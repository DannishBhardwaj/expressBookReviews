const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Please provide both username and password")
    }

    
    const userExists = users.some(user => user.username === username)

    if (userExists) {
        return res.status(409).send(username + " already exists")
    } else {
        users.push({ "username": username, "password": password })
        return res.status(201).send("User " + username + " added")
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const bookList = JSON.stringify(books)
    res.send(bookList)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    let booksOfAuthor = {}
    Object.keys(books).forEach(key => {
        if (books[key].author === author) {
            booksOfAuthor[key] = books[key]
        }
    })
    res.send(booksOfAuthor)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    let booksByTitle = {}
    Object.keys(books).forEach(key => {
        if (books[key].title === title) {
            booksByTitle[key] = books[key]
        }
    })
    res.send(booksByTitle)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
