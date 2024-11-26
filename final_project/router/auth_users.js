const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = parseInt(req.params.isbn); // Extract the ISBN from the URL
    const username = req.session?.authorization?.username; // Get the logged-in user's username

    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const book = books[isbn]; // Find the book by ISBN

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "Review not found for the logged-in user" });
    }

    // Delete the user's review
    delete book.reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully",
        reviews: book.reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
