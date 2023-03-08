// Initialize Firebase
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
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
