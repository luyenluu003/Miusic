// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmKc88JzEXHp4LO6mlDWS6sJkaVm6gpD4",
  authDomain: "miusic-blog.firebaseapp.com",
  projectId: "miusic-blog",
  storageBucket: "miusic-blog.appspot.com",
  messagingSenderId: "783258025108",
  appId: "1:783258025108:web:9f5eedaaabc77674228881",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//google auth
const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
};
