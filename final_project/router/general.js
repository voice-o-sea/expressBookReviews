const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login." });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Provide username and password." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let book = books[req.params.isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Unable to find the book." });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let matched = Object.values(books).filter(b => b.author === req.params.author);
  return res.status(200).send(JSON.stringify(matched, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let matched = Object.values(books).filter(b => b.title === req.params.title);
  return res.status(200).send(JSON.stringify(matched, null, 4));
});

//  Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  let book = books[req.params.isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Unable to find the book." });
  }
});

const serverUrl = 'http://localhost:5000';

const getBooks = async () => {
  try {
    const response = await axios.get(serverUrl + '/');
    return response.data;
  } catch (error) {
    throw error;
  }
}

const getBooksByIsbn = async (isbn) => {
  try {
    const response = await axios.get(serverUrl + '/isbn/' + isbn);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(serverUrl + '/author/' + author);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(serverUrl + '/title/' + title);
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports.general = public_users;

module.exports.getBooks = getBooks;
module.exports.getBooksByIsbn = getBooksByIsbn;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;