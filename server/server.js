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
import Blog from "./Schema/Blog.js";

import { memoryStorage } from "multer";
import Notification from "./Schema/Notification.js";
import Comment from './Schema/Comment.js'
import { error } from "console";
import path from "path";
import { populate } from "dotenv";
import e from "express";

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


const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.status(401).json({ error: 'No access token' })
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Access token is invalid ' })
    }
    req.user = user.id
    next()
  })
}

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

server.post("/change-password", verifyJWT, (req, res) => {
  let {currentPassword, newPassword} = req.body

  if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
    return res.status(403).json({error:"Password should be 6 to 20 characters long with a numeric , 1 lowercase and 1 uppercase letters"})
  }

  User.findOne({_id:req.user})
  .then((user)=>{
    if(user.google_auth){
      return res.status(403).json({error:"You can't change account password using google auth"})
    }
    bcrypt.compare(currentPassword,user.personal_info.password,(err,result)=>{
      if(err){
        return res.status(500).json({error:"Some error occured while changing password, please try again later"})
      }

      if(!result){
        return res.status(403).json({error:"Incorrect password"})
      }
      bcrypt.hash(newPassword,10,(err,hashed_password)=>{
        User.findOneAndUpdate({_id:req.user},{"personal_info.password":hashed_password})
        .then((u)=>{
          return res.status(200).json({status:"Password changed"})
        })
        .catch((err)=>{
          return res.status(500).json({error:"Some error occured while changing password, please try again later"})
        })
      })
    })
  })
  .catch((err)=>{
    console.log(err)
    res.status(500).json({error:"User not found"})
  })
})

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

server.post("/update-profile-img",verifyJWT, (req, res) => {
  let {url} = req.body;
  User.findOneAndUpdate({_id:req.user},{"personal_info.profile_img":url})
  .then(()=>{
    return res.status(200).json({profile_img:url})
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })
})

server.post("/update-profile",verifyJWT,(req,res)=>{
  
  let {username,bio,social_links} = req.body
  console.log("Socail_links",social_links)
  console.log("Username",username)
  console.log("Bio",bio)
  let bioLimit=150
  if(username.length<3){
    return res.status(403).json({error:"Username must be at least 3 letters long"})
  }
  if(bio.length>bioLimit){
    return res.status(403).json({error:`Bio must be under ${bioLimit} characters`})
  }

  let socicalLinksArr = Object.keys(social_links)
  try{
    for(let i=0;i<socicalLinksArr.length;i++){
      if(social_links[socicalLinksArr[i]].length){
        let hostname = new URL(social_links[socicalLinksArr[i]]).hostname

        if(!hostname.includes(`${socicalLinksArr[i]}.com`) && socicalLinksArr[i] != 'website'){
          return res.status(403).json({error:`${socicalLinksArr[i]} link is invalid. You must enter a full link`})
        }
      }
    }
  }catch(err){
    return res.status(500).json({error:"You must provide full social links with http(s) included"})
  }

  let updateObj = {
    "personal_info.username":username,
    "personal_info.bio":bio,
    social_links
  }
  User.findOneAndUpdate({_id:req.user},updateObj,{
    runValidators:true
  })
  .then(()=>{
    return res.status(200).json({username})
  })
  .catch(err=>{
    if(err.code ==11000){
      return res.status(409).json({error:"Username is already taken"})
    }
    return res.status(500).json({error:err.message})
  })
})

server.post("/create-blog", verifyJWT, (req, res) => {
  let authorId = req.user;
  let { title, des, banner, music, tags, content, draft,id } = req.body;
  if (!title.length) {
    return res
      .status(403)
      .json({ error: "You must provide a title to publish the post" });
  }
  if (!draft) {
    if (!des.length || des.length > 10000) {
      return res.status(403).json({
        error: "You must provide post description under 10000 characters",
      });
    }
    if (!banner.length) {
      return res
        .status(403)
        .json({ error: "You must provide post banner to publish it" });
    }
    if (!music.length) {
      return res
        .status(403)
        .json({ error: "You must provide post music to publish it" });
    }
    if (!content.blocks.length) {
      return res
        .status(403)
        .json({ error: "There must be some post content to publish it" });
    }
    if (!tags.length || tags.length > 10) {
      return res.status(403).json({
        error: "Provide tags in order to publish the post, Maxiumum 10 tags",
      });
    }
  }

  tags = tags.map((tag) => tag.toLowerCase());
  let blog_id = id ||title.replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, "-").trim() + nanoid();
  if(id){
    Blog.findOneAndUpdate({blog_id},{title,des,banner,music,content,tags, draft:draft ? draft:false})
    .then(() =>{
      return res.status(200).json({id:blog_id})
    })
    .catch(err =>{
      return res.status(500).json({error:"Failed to update total posts number"})
    })
  }else{
    let blog = new Blog({
      title,
      des,
      banner,
      music,
      content,
      tags,
      author: authorId,
      blog_id,
      draft: Boolean(draft),
    });
  
    blog
      .save()
      .then((blog) => {
        let incrementVal = draft ? 0 : 1;
        User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { "account_info.total_posts": incrementVal },
            $push: { blogs: blog._id },
          }
        )
          .then((user) => {
            return res.status(200).json({ id: blog.blog_id });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: "Failed to update total post number" });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }

  
});

server.get("/latest-blogs", (req, res) => {
  // let maxLimit = 5
  Blog.find({ draft: false })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "publishedAt": -1 })
    .select("blog_id title des banner music activity tags publishedAt -_id")
    // .limit(maxLimit)
    .then(blogs => {
      return res.status(200).json({ blogs })
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message })
    })
})

server.post("/search-users",(req,res)=>{
  let {query} = req.body
  User.find({"personal_info.username": new RegExp(query,'i')})
  .limit(50)
  .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
  .then(users =>{
    return res.status(200).json({users})
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })
})

server.post("/get-profile",(req,res)=>{
  let {username} = req.body;
  User.findOne({"personal_info.username":username})
  .select("-personal_info.password -google_auth -updateAt -blogs")
  .then(user =>{
    return res.status(200).json(user)
  })
  .catch(err =>{
    console.log(err);
    return res.status(500).json({err:err.message})
  })
})


server.post("/all-latest-blogs-count",(req,res) =>{
  Blog.countDocuments({draft:false})
  .then(count =>{
    return res.status(200).json({totalDocs:count})
  })
  .catch(err =>{
    console.log(err.message)
    return res.status(500).json({err:err.message})
  })
})

server.post("/search-blogs",(req,res) =>{
  let {tag,query,author,page} = req.body
  let findQuery ;

  if(tag){
    findQuery = {tags:tag,draft:false}
  }else if(query){
    findQuery = {draft:false,title: new RegExp(query, "i") } 
  }else if(author){
    findQuery = {author, draft:false}
  }

  // let maxLimit = 2

  Blog.find(findQuery).populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({"publishedAt":-1})
  .select("blog_id title des banner music activity tags publishedAt -_id")
  // .skip((page-1)*maxLimit)
  // .limit(maxLimit)
  .then(blogs => {
    return res.status(200).json({blogs})
  })
  .catch((err) => {
    return res.status(500).json({error:err.message})
  })
})

server.post("/search-blogs-count",(req,res) =>{
  let {tag,author,query} = req.body

  let findQuery 
  if(tag){
    findQuery = {tags:tag,draft:false}
  }else if(query){
    findQuery = {draft:false,title: new RegExp(query, "i") } 
  }else if(author){
    findQuery = {author, draft:false}
  }
  Blog.countDocuments(findQuery)
  .then(count =>{
    return res.status(200).json({totalDocs:count})
  })
  .catch(err =>{
    console.log(err.message)
    return res.status(500).json({err:err.message})
  })
})

server.post("/get-blog",(req,res)=>{
  let {blog_id,draft,mode} = req.body;
  let incrementVal=mode != 'edit' ? 1:0;
  Blog.findOneAndUpdate({blog_id},{$inc:{"activity.total_reads":incrementVal}})
  .populate("author","personal_info.fullname personal_info.username personal_info.profile_img")
  .select("title des content banner music activity publishedAt blog_id tags")
  .then(blog=>{
    User.findOneAndUpdate({"personal_info.username":blog.author.personal_info.username},{
      $inc:{"account_info.total_reads":incrementVal}
    })
    .catch(err =>{
      return res.status(500).json({error:"you can not access draft blogs"})
    })
    if(blog.draft && !draft){
      return res.status(500).json({blog})
    }
    return res.status(200).json({blog});
  })
  .catch(err =>{
    return res.status(500).json({error:err.message})
  })
})

server.post("/like-blog",verifyJWT,(req,res)=>{
  let user_id = req.user;
  let {_id,islikedByUser } = req.body;

  let incrementVal = !islikedByUser ? 1 : -1;

  Blog.findOneAndUpdate({_id},{ $inc: { "activity.total_likes": incrementVal } })
  .then(blog =>{
    if(!islikedByUser){
      let like = new Notification({
        type:"like",
        blog:_id,
        notification_for:blog.author,
        user:user_id
      })

      like.save().then(notification=>{
        return res.status(200).json({liked_by_user:true})
      })
    }else{
      Notification.findOneAndDelete({user:user_id,blog:_id, type:"like"})
      .then(data =>{
        return res.status(200).json({liked_by_user:false})
      }).catch(err =>{
        return res.status(500).json({error:err.message})
      })
    }
  })

})

server.post("/isliked-by-user",verifyJWT,(req,res)=>{
  let user_id = req.user;
  let {_id} = req.body

  Notification.exists({user:user_id, type:"like",blog:_id})
  .then(result =>{
    return res.status(200).json({result})
  }).catch(err =>{
    return res.status(500).json({error:err.message})
  })
})


// Comment
server.post("/add-comment",verifyJWT,(req,res)=>{
  let user_id = req.user;
  let { _id,comment,blog_author ,replying_to} = req.body;
  if(!comment.length){
    return res.status(403).json({error:"Write something to leave a comment!"})
  }
  //Tạo tài liệu để bình luận
  let commentObj =  {
    blog_id:_id,blog_author,comment,commented_by:user_id ,
  }

  if(replying_to){
    commentObj.parent=replying_to
    commentObj.isReply = true;
  }
  new Comment(commentObj).save().then(async commentFile=>{
    let {comment,commentedAt,children} = commentFile

    Blog.findOneAndUpdate({_id},{$push:{"comments":commentFile._id},$inc:{"activity.total_comments":1,"activity.total_parent_comments": replying_to ? 0: 1}}).then(blog=>{
      console.log("New comment created")  
    })

    let notificationObj = {
      type:replying_to ? "reply":"comment",
      blog:_id,
      notification_for:blog_author,
      user:user_id,
      comment:commentFile._id
    }

    if(replying_to){
      notificationObj.replied_on_comment = replying_to
      
      await Comment.findOneAndUpdate({_id:replying_to},{$push:{ children:commentFile._id}})
      .then(replyingToCommentDoc=>{notificationObj.notification_for = replyingToCommentDoc.commented_by})

      
    }

    new Notification(notificationObj).save().then(notification =>{
      console.log("new notificaion created")
    })

    return res.status(200).json({comment,commentedAt,_id:commentFile._id,user_id,children})
  })
})

server.post("/get-blog-comments",(req,res)=>{
  let {blog_id,skip} = req.body
  let maxLimit = 5;
  Comment.find({blog_id,isReply:false})
  .populate("commented_by","personal_info.username personal_info.fullname personal_info.profile_img")
  .skip(skip)
  .limit(maxLimit)
  .sort({
    'commentedAt':-1
  })
  .then(comment =>{
    return res.status(200).json(comment)
  })
  .catch(err=>{
    console.log(err.message)
    return res.status(500).json({error:err.message})
  })
})

server.post("/get-replies",(req,res)=>{
  let {_id,skip} = req.body
  let maxLimit = 5;

  Comment.findOne({_id})
  .populate({
    path:"children",
    options:{
      limit:maxLimit,
      skip:skip,
      sort:{
        'commentedAt':-1
      },
    },
    populate:{
      path:"commented_by",
      select:"personal_info.profile_img personal_info.fullname personal_info.username "
    },
    select:"-blog_id -updatedAt"

  })
  .select("children")
  .then(doc =>{
    return res.status(200).json({replies:doc.children})
  })
  .catch(err =>{
    return res.status(500).json({error:err.message})
  })
})

const deleteComments = (_id) =>{
  Comment.findOneAndDelete({_id})
  .then(comment =>{
    if(comment.parent){
      Comment.findOneAndUpdate({_id:comment.parent},{$pull:{children:_id}})
      .then(data=>{
        console.log("comment delete from parent")
      })
      .catch(err=>{
        console.log(err)
      })
    }

    Notification.findOneAndDelete({comment:_id}).then(notification=>console.log('comment notification deleted'))

    Notification.findOneAndDelete({reply:_id}).then(notification=>console.log('reply notification deleted'))

    Blog.findOneAndUpdate({_id:comment.blog_id},{$pull:{comments:_id},$inc:{"activity.total_comments": -1},"activity.total_parent_comments": comment.parent ? 0: -1})
    .then(blog =>{
      if(comment.children.length){
        comment.children.map(replies=>{
          deleteComments(replies)
        })
      }
    })

  })
  .catch(err=>{
    console.log(err.message)
  })
}

server.post("/delete-comment",verifyJWT,(req,res)=>{
  let user_id = req.user;

  let {_id}  = req.body

  Comment.findOne({_id})
  .then(comment =>{
    if(user_id == comment.commented_by || user_id == comment.blog_author){
        deleteComments(_id)
        return res.status(200).json({status:'done'})
    }else{
      return res.status(403).json({error:"You can not delete this comment"})
    }
  })
})

server.get("/new-notification",verifyJWT,(req,res)=>{
  let user_id = req.user;
  Notification.exists({notification_for:user_id,seen:false,user:{$ne:user_id}})
  .then(result =>{
    if(result){
      return res.status(200).json({new_notification_available:true})
    }else{
      return res.status(200).json({new_notification_available:false})
    }
  })
  .catch(err=>{
    console.log(err.message)
    return res.status(500).json({error:err.message})
  })
})

server.post("/notifications",verifyJWT,(req,res)=>{
  let user_id = req.user

  let {page,filter,deletedDocCount} = req.body

  let maxLimit = 10

  let findQuery = {notification_for:user_id,user:{$ne:user_id}}

  let skipDocs =  (page - 1) * maxLimit
  if(filter != 'all'){
    findQuery.type= filter
  }

  if(deletedDocCount){
    skipDocs -= deletedDocCount
  }

  Notification.find(findQuery)
  .skip(skipDocs)
  .limit(maxLimit)
  .populate("blog","title blog_id")
  .populate("user","personal_info.fullname personal_info.username personal_info.profile_img")
  .populate("comment","comment")
  .populate("replied_on_comment","comment")
  .populate("reply","comment")
  .sort({createdAt:-1})
  .select("createdAt type seen reply")
  .then(notifications =>{
    return res.status(200).json({notifications})
  })
  .catch(err =>{
    console.log(err.message)
    return res.status(500).json({error:err.message})
  })
})

server.post("/all-notifications-count",verifyJWT,(req,res)=>{
  let user_id = req.user;

  let {filter} = req.body;

  let findQuery = {notification_for:user_id,user:{$ne:user_id}}
  if(filter != 'all'){
    findQuery.type = filter;
  }
  Notification.countDocuments(findQuery)
  .then(count =>{
    return res.status(200).json({totalDocs:count})
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })
})

server.listen(PORT, () => {
  console.log("Listening on port -> " + PORT);
});
