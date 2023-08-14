const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    const { rating, comment } = req.body;
    const Review = require('path/to/review/model');
    const Book = require('path/to/book/model');
  
    const newReview = new Review({
      isbn,
      rating,
      comment
    });
  
    newReview.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to add review', error: err });
      }
      books.findOneAndUpdate(
        { isbn },
        { $push: { reviews: newReview }, $inc: { totalRating: rating, reviewCount: 1 } },
        { new: true },
        (err, updatedBook) => {
          if (err) {
            return res.status(500).json({ message: 'Failed to update book', error: err });
          }
          return res.status(200).json({ message: 'Review added successfully', book: updatedBook });
        }
      );
    });
  });
  


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
