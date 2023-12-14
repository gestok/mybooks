// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
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
