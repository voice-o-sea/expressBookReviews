const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  let matched = users.filter(u => u.username === username);
  return matched.length === 0;
}

const authenticatedUser = (username, password) => { //returns boolean
  let matched = users.filter(u => u.username === username && u.password === password);
  return matched.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "User successfully logged in." });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  if (book) {
    book.reviews[req.session.authorization.username] = req.query.review;
    return res.status(200).json({ message: "Review added.", reviews: book.reviews });
  } else {
    return res.status(404).json({ message: "Unable to find the book." });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  if (book) {
    delete book.reviews[req.session.authorization.username];
    return res.status(200).json({ message: "Review deleted." });
  } else {
    return res.status(404).json({ message: "Unable to find the book." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
