const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN (which corresponds to the numeric ID in the books object)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);  // Convert the ISBN to an integer (since your keys are numeric)

    // Check if the book with the given ISBN exists
    const book = books[isbn];

    if (book) {
        // Send the book details if found
        res.json(book); // JSON response with book details
    } else {
        // Return a 404 error if the book is not found
        res.status(404).json({ message: "Book not found!" });
    }
});

  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.trim(); // Get the author from the request parameters and remove extra spaces

    console.log("Searching for books by author:", author);  // Log the author to check the value

    // Find books that match the author
    const booksByAuthor = [];
    for (let key in books) {
        // Log the current book's author for debugging
        console.log("Checking book:", books[key].title, "by", books[key].author);

        if (books[key].author.toLowerCase().trim() === author.toLowerCase()) {
            booksByAuthor.push(books[key]);
        }
    }

    if (booksByAuthor.length > 0) {
        // Send the books by this author as a JSON response
        res.json(booksByAuthor);
    } else {
        // Return a 404 error if no books by the author are found
        res.status(404).json({ message: "No books found by this author!" });
    }
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.trim(); // Get the author from the request parameters and remove extra spaces

   
    // Find books that match the author
    const booksByTitle = [];
    for (let key in books) {
        
        if (books[key].title.toLowerCase().trim() === title.toLowerCase()) {
            booksByTitle.push(books[key]);
        }
    }

    if (booksByTitle.length > 0) {
        // Send the books by this author as a JSON response
        res.json(booksByTitle);
    } else {
        // Return a 404 error if no books by the author are found
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);  // Convert ISBN to an integer

    // Check if the book with the given ISBN exists
    const book = books[isbn];

    if (book) {
        // Send the reviews of the book as a JSON response
        res.json(book.reviews);  // Send the reviews of the book
    } else {
        // Return a 404 error if the book is not found
        res.status(404).json({ message: "Book not found!" });
    }
});


module.exports.general = public_users;
