import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin";
import serviceAccountKey from "./miusic-blog-firebase-adminsdk-maahk-8d3a4e07a7.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";
import aws from "aws-sdk";
import nodemailer from "nodemailer";
import crypto from "crypto";
import multer from "multer";
//schema below
import User from "./Schema/User.js";

import { memoryStorage } from "multer";
const storage = memoryStorage();
const upload = multer({ storage });

const server = express();
let PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

//setting up s3 bucket
const s3 = new aws.S3({
  region: "ap-southeast-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "miusic-blog",
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg",
  });
};

const generateUploadAudioURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.mp3`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "miusic-blog",
    Key: imageName,
    Expires: 30,
    ContentType: "audio/mpeg",
  });
};

// const upLoadAudio = (filename, bucketname, file) => {
//   return new Promise((resolve, reject) => {
//     const params = {
//       Key: filename,
//       Bucket: bucketname,
//       Body: file,
//       ContentType: "audio/mpeg",
//     };
//     s3.upload(params, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// };

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUsernameNotUnique ? (username += nanoid().substring(0, 5)) : "";

  return username;
};

//upload img url route
server.get("/get-upload-url", (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.get("/get-upload-music-url", (req, res) => {
  generateUploadAudioURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

//upload music url route
// server.post(
//   "/get-upload-music-url",
//   upload.single("audiofile"),
//   async (req, res) => {
//     const date = new Date();
//     const audioname = `${nanoid()}-${date.getTime()}.mp3`;
//     const filename = audioname;
//     const bucketname = "miusic-blog";
//     const file = req.file.buffer;
//     console.log("File", file);
//     const link = await upLoadAudio(filename, bucketname, file);
//     console.log("Link", link);
//     res.send("upload successfully");
//   }
// );

server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;
  //validating the data from frontend
  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 letters long" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "Enter email" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is invalid" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should be 6 to 20 characters long with a numeric , 1 lowercase and 1 uppercase letters",
    });
  }
  bcrypt.hash(password, 10, async (err, hashed_password) => {
    let username = await generateUsername(email);

    let user = new User({
      personal_info: { fullname, email, password: hashed_password, username },
    });

    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDatatoSend(u));
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res.status(500).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: err.message });
      });

    console.log(hashed_password);
  });
});
server.post("/signin", (req, res) => {
  let { email, password } = req.body;
  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email not found" });
      }

      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res
              .status(403)
              .json({ error: "Error occured while login please try again" });
          }
          if (!result) {
            return res.status(403).json({ error: "Incorrect password" });
          } else {
            return res.status(200).json(formatDatatoSend(user));
          }
        });
      } else {
        return res.status(403).json({
          error:
            "Account was created using google. Try logging in with google.",
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      if (user) {
        //login
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email sigged up without Google. Please log in with password to access the account",
          });
        }
      } else {
        //sign up
        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,
            profile_img: picture,
            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }

      return res.status(200).json(formatDatatoSend(user));
    })
    .catch((err) => {
      return res.status(500).json({
        error:
          "Failed to authenticate you with google. Try with some other google account",
      });
    });
});

//Email
// check email
const checkEmailExistence = async (email) => {
  try {
    if (typeof email !== "string") {
      throw new Error("Invalid email format");
    }
    const existingUser = await User.findOne({ "personal_info.email": email });
    return !!existingUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

server.post("/check-email", async (req, res) => {
  const { email } = req.body;
  try {
    const isEmailExist = await checkEmailExistence(email);

    if (isEmailExist) {
      // Email đã tồn tại, không gửi mã xác minh và thông báo lỗi
      console.log("isEmailExit:", isEmailExist);
      return res.status(200).json({
        isEmailExist,
        verificationCodeSent: false,
        error: "Email is already registered",
      });
    }

    // Email không tồn tại, tiếp tục gửi mã xác minh
    try {
      console.log("isEmailExit:", isEmailExist);
      const response = await sendVerificationCode(email);
      console.log("respoense", response);
      res
        .status(200)
        .json({ isEmailExist, verificationCodeSent: true, response });
    } catch (error) {
      res.status(500).json({
        error: "Failed to send verification code",
        verificationCodeSent: false,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

// server.post("/check-email", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const isEmailExist = await checkEmailExistence(email);
//     console.log("isEmailExit:", isEmailExist);
//     res.status(500).json({ error: "Internal Server Error" });
//     if (!isEmailExist) {
//       res.status(200).json({ isEmailExist });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
//Gửi mã OTP
const verificationCodes = {};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "violetbaka03@gmail.com",
    pass: "jmbyxxgecrertzod",
  },
});

const sendVerificationCode = (email) => {
  const verificationCode = crypto.randomInt(100000, 999999);
  verificationCodes[email] = verificationCode;

  const mailOptions = {
    from: "violetbaka03@gmail.com",
    to: email,
    subject: "Xác nhận code của Totmusica : ",
    text: `Mã xác nhận của bạn là: ${verificationCode}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Email xác nhận đã được gửi: " + info.response);
        resolve(info.response);
      }
    });
  });
};

server.post("/send-verification-code", async (req, res) => {
  const { email } = req.body;
  try {
    const response = await sendVerificationCode(email);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});
const verifyCode = (email, code) => {
  console.log("code ve:", code);
  console.log("email ve:", email);
  console.log("Mã code đã sinh ra:", verificationCodes[email]);
  if (verificationCodes[email] && verificationCodes[email] == code) {
    delete verificationCodes[email];
    return "Xác nhận thành công.";
  } else {
    return "Mã xác nhận không đúng.";
  }
};

server.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  console.log("code:", code);
  console.log("email:", email);
  console.log("Mã code sv:", verificationCodes[email]);

  const response = verifyCode(email, code);
  console.log("response", response);

  if (response.startsWith("Xác nhận")) {
    res.status(200).send(response);
  } else {
    res.status(200).send({ error: response });
  }
});
server.listen(PORT, () => {
  console.log("Listening on port -> " + PORT);
});
