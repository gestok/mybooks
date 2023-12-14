// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID
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
