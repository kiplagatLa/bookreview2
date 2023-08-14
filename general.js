const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try{
    let response = await axios.get('https:db-books.onrender.com/books');
    res.send(JSON.stringify(books));
} catch(error){
    console.log(error);
    throw error;
}});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const foundBook = books.find(book => book.isbn === isbn);
  if (foundBook) {
    return res.status(200).json({ book: foundBook });
  } else {
    return res.status(404).json({ message: 'isbn not found' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];

  for (const key in books) {
      if (books.hasOwnProperty(key)) {
          const book = books[key];
          if (book.author === author) {
              booksByAuthor.push(book);
          }
      }
  }

  if (booksByAuthor.length > 0) {
      res.send(booksByAuthor);
  } else {
      res.send("No books found for the provided author.");
  }
});




// Get all books based on title
public_users.get('/title/:title',function (req, res) {
const title = req.params.title;
let booksByTitle = [];

for (const key in books) {
    if (books.hasOwnProperty(key)) {
        const book = books[key];
        if (book.title === title) {
            booksByTitle.push(book);
        }
    }
}

if (booksByTitle.length > 0) {
    res.send(booksByTitle);
} else {
    res.send("No books found for the provided title.");
}
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        res.send(book.reviews);
    } else {
        res.send("No reviews found for the provided ISBN.");
    }
});

module.exports.general = public_users;
