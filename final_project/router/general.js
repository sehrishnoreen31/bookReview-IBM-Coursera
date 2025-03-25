const express = require('express');
const router = express.Router();
const books = require('./booksdb.js');

// ✅ TASK 1: Get all books
router.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// ✅ TASK 2: Get book by ISBN
router.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// ✅ TASK 3: Get books by author
router.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
  
  for (const isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }
  res.send(booksByAuthor);
});

// ✅ TASK 4: Get books by title
router.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];
  
  for (const isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  }
  res.send(booksByTitle);
});

// ✅ TASK 5: Get book reviews
router.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Async/Promise versions
const axios = require('axios');

// Task 10: Async get all books
router.get('/async-get-books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Task 11: Promise get by ISBN
router.get('/promise-get-books/isbn/:isbn', function (req, res) {
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(response => res.send(response.data))
    .catch(error => res.status(500).send("Error fetching book"));
});

// Task 12: Async get books by author
router.get('/async-get-books/author/:author', async function (req, res) {
  try {
    // 1. Fetch all books asynchronously
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;

    // 2. Filter books by author (case-insensitive)
    const authorName = req.params.author.toLowerCase();
    const filteredBooks = Object.values(allBooks).filter(
      book => book.author.toLowerCase().includes(authorName)
    );

    // 3. Send response
    res.status(200).json({
      success: true,
      message: `Found ${filteredBooks.length} books by author '${req.params.author}'`,
      data: filteredBooks
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching books"
    });
  }
});

// Task 13: Async get books by title
router.get('/async-get-books/title/:title', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(response.data).filter(
      book => book.title.toLowerCase().includes(title)
    );
    res.status(200).json({
      success: true,
      data: filteredBooks
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
module.exports.general = router;