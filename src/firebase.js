import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpsVlhENGCL0Kj4zjLHIhS32d8oi1LerA",
  authDomain: "logintestogram.firebaseapp.com",
  projectId: "logintestogram",
  storageBucket: "logintestogram.appspot.com",
  messagingSenderId: "137261588775",
  appId: "1:137261588775:web:01ef0f9fea1d5b8257c902",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
export {
  // kad je ključ jendak vrijednost može se skratiti npr. firebase:firebase u
  firebase,
  db,
};
