const registerUser = () => {
  if (document.getElementById('alert'))
    document.getElementById('alert').remove();
  const alert = document.createElement('span');
  alert.id = 'alert';

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(async (res) => {
      await auth.signInWithEmailAndPassword(email, password).then((res) => {
        // LocalStorage
        isAuth.id = res.user.uid;
        isAuth.name = name;
        isAuth.avatar = res.user.photoURL || false;
        isAuth.email = res.user.email;
        localStorage.setItem('isAuth', JSON.stringify(isAuth));
        saveUserData(
          auth.currentUser.uid,
          name,
          isAuth.collection,
          isAuth.read,
          isAuth.library
        );
      });
      alert.classList.add('success');
      alert.innerText = `Account for ${res.user.email} was created successfully! Logging and redirecting...`;
      document.getElementById('modal').appendChild(alert);
      setTimeout(() => window.location.reload(), 2000);
    })
    .catch((err) => {
      alert.classList.add('error');
      alert.innerText = err.message.replace('Firebase: ', '');
      document.getElementById('modal').appendChild(alert);
    });
};

const loginUser = () => {
  if (document.getElementById('alert'))
    document.getElementById('alert').remove();
  const alert = document.createElement('span');
  alert.id = 'alert';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth
    .signInWithEmailAndPassword(email, password)
    .then(async (res) => {
      // LocalStorage
      await db
        .collection('users')
        .doc(`${auth.currentUser.uid}`)
        .get()
        .then((doc) => {
          isAuth.name = doc.data().name;
          isAuth.collection = doc.data().collection;
          isAuth.read = doc.data().read;
          return isAuth;
        })
        .catch((err) => console.log('Error getting document: ', err));
      await db
        .collection('libraries')
        .doc(`${auth.currentUser.uid}`)
        .get()
        .then((doc) => {
          isAuth.library = doc.data() || {};
          return isAuth;
        });
      isAuth.id = res.user.uid;
      isAuth.avatar = res.user.photoURL || false;
      isAuth.email = res.user.email;
      localStorage.setItem('isAuth', JSON.stringify(isAuth));

      // Alert
      alert.classList.add('success');
      alert.innerText = `Signed in successfully! Redirecting...`;
      document.getElementById('modal').appendChild(alert);
      setTimeout(() => window.location.reload(), 2000);
    })
    .catch((err) => {
      alert.classList.add('error');
      alert.innerText = err.message.replace('Firebase: ', '');
      document.getElementById('modal').appendChild(alert);
    });
};

const register = () => {
  // If modal open, destroy it
  if (document.body.querySelector('.overlay'))
    document.body.querySelector('.overlay').remove();
  // Create Modal
  const modal = document.createElement('div');
  modal.classList.add('overlay');
  modal.innerHTML = `
    <div id="modal">
      <div class="header d-flex flex-column gap-sm">
        <h2>Let's get started!</h2>
        <span>Please fill in your details:</span>
      </div>
      <form class="d-flex flex-column gap-md" action="javascript:void(0);" onsubmit="registerUser()">
        <div class="inputWrapper d-flex relative">
          <input type="text" name="name" id="name" required />
          <label for="name">Name</label>
        </div>
        <div class="inputWrapper d-flex relative">
          <input type="email" name="email" id="email" required />
          <label for="email">Email</label>
        </div>
        <div class="inputWrapper d-flex relative">
          <input type="password" name="password" id="password" required />
          <label for="password">Password</label>
        </div>
        <button type="submit">Register</button>
      </form>
      <span class="notice">Already have an account? <a onclick="login()" title="Login">Log in!</a></span>
    </div>
  `;
  // Insert Modal
  document.body.appendChild(modal);
};

const login = () => {
  // If modal open, destroy it
  if (document.querySelector('.overlay'))
    document.querySelector('.overlay').remove();
  // Create Modal
  const modal = document.createElement('div');
  modal.classList.add('overlay');
  modal.innerHTML = `
    <div id="modal">
      <div class="header d-flex flex-column gap-sm">
        <h2>Welcome back!</h2>
        <span>Please enter your credentials:</span>
      </div>
      <form class="d-flex flex-column gap-md" action="javascript:void(0);" onsubmit="loginUser()">
        <div class="inputWrapper d-flex relative">
          <input type="email" name="email" id="email" required />
          <label for="email">Email</label>
        </div>
        <div class="inputWrapper d-flex relative">
          <input type="password" name="password" id="password" required />
          <label for="password">Password</label>
        </div>
        <button type="submit">Login</button>
      </form>
      <span class="notice">Don't have an account? <a onclick="register()" title="Register">Create one!</a></span>
    </div>
  `;
  // Insert Modal
  document.body.appendChild(modal);
};

const saveUserData = async (uid, name, collection, read, library) => {
  await db
    .collection('users')
    .doc(`${uid}`)
    .set({
      name: name,
      collection: collection,
      read: read,
    })
    .catch((err) => console.log('Error adding document.'));
  await db
    .collection('libraries')
    .doc(`${uid}`)
    .set(library)
    .catch((err) => console.log('Error adding document.'));
};

// Logs the user out and saves the localStorage to Database
const logOut = async () => {
  // Store localStorage to database
  const data = JSON.parse(localStorage.getItem('isAuth'));
  await db.collection('users').doc(`${auth.currentUser.uid}`).update({
    collection: data.collection,
    read: data.read,
  });
  await db
    .collection('libraries')
    .doc(`${auth.currentUser.uid}`)
    .set(data.library);

  // Sign out
  auth
    .signOut()
    .then((res) => {
      // Clear LocalStorage
      localStorage.removeItem('isAuth');
      // Reload in 0.6s
      setTimeout(() => window.location.reload(), 600);
    })
    .catch((err) => console.log('There was an error is the signout.'));
};
