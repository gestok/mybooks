document.addEventListener('DOMContentLoaded', () => {
  // Expand and Center new book form
  document.querySelector('#add .btn').addEventListener('click', () => {
    document.getElementById('add').classList.toggle('center');
  });
  initialBooks();
});

// Function to restore initial books on DOM refresh
const initialBooks = async () => {
  // If localstorage is set
  if (!localStorage.getItem('isAuth')) return;
  const data = JSON.parse(localStorage.getItem('isAuth'));
  // If localstorage is set and contains books
  if (Object.keys(data.library).length === 0) return;
  // For each book add the book info
  for (const [key, value] of Object.entries(data.library)) {
    await addBook(value.isbn, value.title, value.author, value.didRead);
  }
};

// On Form Submit
const addBookToLibrary = async () => {
  const form = document.getElementById('newbook');
  const isbn = document.getElementById('isbn').value;
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const didRead = document.getElementById('read').checked ? 1 : 0;

  if (localStorage.getItem('isAuth')) {
    const data = JSON.parse(localStorage.getItem('isAuth'));
    data.collection = data.collection + 1;
    data.read = data.read + didRead;
    data.library[`${parseInt(isbn)}`] = { isbn, title, author, didRead };
    localStorage.setItem('isAuth', JSON.stringify(data));
  } else {
    isAuth.collection = isAuth.collection + 1;
    isAuth.read = isAuth.read + didRead;
    isAuth.library[`${parseInt(isbn)}`] = { isbn, title, author, didRead };
    localStorage.setItem('isAuth', JSON.stringify(isAuth));
  }

  // Add book to container
  addBook(isbn, title, author, didRead);

  // Reset Form
  form.reset();
};

const addBook = async (isbn, title, author, didRead) => {
  // Remove FAQ if exists
  const faq = document.getElementById('reminder');
  if (faq) faq.remove();
  // Create Element
  const el = document.createElement('div');
  el.id = `id_${isbn}`;
  el.classList.add('bookcard');
  el.classList.add(didRead ? 'read' : 'notread');
  // Book Volume Details
  let volumeInfo = {};
  let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
  let res = await fetch(url);
  let json = await res.json();
  if (json.totalItems != 0) {
    try {
      volumeInfo = json.items[0].volumeInfo;
      volumeInfo.thumb = volumeInfo.imageLinks.thumbnail.replace(
        'http',
        'https'
      );
    } catch {
      console.log('Invalid Book ISBN found.');
    }
  }
  if (!volumeInfo.thumb) {
    url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`;
    res = await fetch(url.replace(' ', '+'));
    json = await res.json();
    if (json.totalItems != 0) {
      try {
        volumeInfo = json.items[0].volumeInfo;
        volumeInfo.thumb = volumeInfo.imageLinks.thumbnail.replace(
          'http',
          'https'
        );
      } catch {
        console.log('Invalid Book ISBN found.');
      }
    }
    if (!volumeInfo.thumb) {
      // Fallback image
      await storage
        .ref('assets/book-default.png')
        .getDownloadURL()
        .then((url) => {
          volumeInfo.thumb = url;
        })
        .catch((err) => {
          console.log('Default Book Thumbnail not found!');
        });
    }
  }
  // Insert HTML
  el.innerHTML = `
    <div class="contentWrapper">
      <img class="pe-none user-select-none" loading="lazy" width="128px" alt="${title}" src="${
    volumeInfo.thumb
  }" />
      <div class="cardContent">
        <div class="title">${title}</div>
        <div class="author">by ${author}</div>
        ${
          volumeInfo.description
            ? `<div class="desc">${volumeInfo.description.slice(
                0,
                200
              )}...</div>`
            : ''
        }
      </div>
    </div>
    <div class="more d-flex gap-sm justify-content-space-between align-items-center">
      <div class="d-flex flex-column">
        <span>ISBN: ${isbn}</span>
        ${
          volumeInfo.pageCount
            ? `<span>Pages: ${volumeInfo.pageCount}</span>`
            : ''
        }
        <span class="metastatus">Status: ${
          didRead === 1 ? 'Read' : 'Not read'
        }</span>
      </div>
      <div class="actions">
        <button class="btn status secondary" onclick="changeReadStatus(${isbn})">${
    didRead === 1 ? 'Mark as Unread' : 'Mark as Read'
  }</button>
        <button class="btn delete bordered" onclick="removeBook(${isbn})">Remove</button>
      </div>
    </div>
  `;
  // Append Element
  document.getElementById('books').appendChild(el);
};

// Open delete confirmation modal
const removeBook = (isbn) => {
  if (document.querySelector('.overlay'))
    document.querySelector('.overlay').remove();

  const modal = document.createElement('div');
  modal.classList.add('overlay');
  modal.innerHTML = `
    <div id="modal" class="delete">
      <div class="header d-flex flex-column gap-sm">
        <h2>Are you sure?</h2>
        <span>You are about to delete book with ISBN: ${isbn} from your collection.</span>
      </div>
      <div class="d-flex gap-sm align-items-center w100">
        <button class="confirm" onclick="confirmRemove(${isbn})">Continue</button>
        <button onclick="cancelRemove()">Cancel</button>
      </div>
    </div>
  `;
  // Insert Modal
  document.body.appendChild(modal);
};
const confirmRemove = (isbn) => {
  if (document.querySelector('.overlay'))
    document.querySelector('.overlay').remove();

  // Remove from localStorage
  if (!localStorage.getItem('isAuth')) return;
  const data = JSON.parse(localStorage.getItem('isAuth'));
  data.collection = data.collection - 1;
  if (data.library[`${isbn}`].didRead) data.read = data.read - 1;
  delete data.library[`${isbn}`];
  localStorage.setItem('isAuth', JSON.stringify(data));

  // Remove Book from container
  document.getElementById(`id_${isbn}`).remove();
};
const cancelRemove = () => {
  if (document.querySelector('.overlay'))
    document.querySelector('.overlay').remove();
};

// Changes Read status of books
const changeReadStatus = async (isbn) => {
  if (!localStorage.getItem('isAuth')) return;
  const data = JSON.parse(localStorage.getItem('isAuth'));

  const didRead = data.library[`${isbn}`].didRead;
  if (didRead) {
    // Change Book's read status
    data.library[`${isbn}`].didRead = 0;
    // Update User's read count
    data.read = data.read - 1;
    // Update Book's Card visuals
    document.getElementById(`id_${isbn}`).classList.remove('read');
    document.getElementById(`id_${isbn}`).classList.add('notread');
    // Update Action Button's text and Meta info status
    document.querySelector(`#id_${isbn} .metastatus`).innerText =
      'Status: Not read';
    document.querySelector(`#id_${isbn} .status`).innerText = 'Mark as Read';
  } else {
    data.library[`${isbn}`].didRead = 1;
    data.read = data.read + 1;
    document.getElementById(`id_${isbn}`).classList.remove('notread');
    document.getElementById(`id_${isbn}`).classList.add('read');
    document.querySelector(`#id_${isbn} .metastatus`).innerText =
      'Status: Read';
    document.querySelector(`#id_${isbn} .status`).innerText = 'Mark as Unread';
  }

  // Update localStorage
  localStorage.setItem('isAuth', JSON.stringify(data));
};
