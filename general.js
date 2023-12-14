// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_D7VxB7l9MVDB40AiCa0mIDSf_qQytXs",
  authDomain: "mybooks-application.firebaseapp.com",
  projectId: "mybooks-application",
  storageBucket: "mybooks-application.appspot.com",
  messagingSenderId: "818809500062",
  appId: "1:818809500062:web:5916ed7d935a969ef8668f"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();
const storage = firebase.storage();

// User's Local State
const isAuth = {
  collection: localStorage.getItem('isAuth')
    ? JSON.parse(localStorage.getItem('isAuth')).collection
    : 0,
  read: localStorage.getItem('isAuth')
    ? JSON.parse(localStorage.getItem('isAuth')).read
    : 0,
  library: localStorage.getItem('isAuth')
    ? JSON.parse(localStorage.getItem('isAuth')).library
    : {},
};
