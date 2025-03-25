const express = require('express');
const router = express.Router();
const books = require('./booksdb.js');
const jwt = require('jsonwebtoken');

let users = [];

// ✅ TASK 6: Register user
router.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username & password required"});
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  users.push({username, password});
  return res.status(201).json({message: "User registered successfully"});
});

// ✅ TASK 7: Login
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({message: "Invalid credentials"});
  }

  const token = jwt.sign({username}, "access", {expiresIn: "1h"});
  req.session.authorization = {accessToken: token};
  return res.status(200).json({message: "Login successful"});
});

// ✅ TASK 8: Add/modify review
router.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added/modified"});
});

// ✅ TASK 9: Delete review
router.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn] || !books[isbn].reviews[username]) {
    return res.status(404).json({message: "Review not found"});
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({message: "Review deleted"});
});

module.exports.authenticated = router;