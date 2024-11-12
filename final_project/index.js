const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

let users = [];

// Check if a user with the given username already exists
const doesExist = (username) => {
    return users.some(user => user.username === username);
};

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

const app = express();

app.use(
    session({
        secret: "fingerprint_customer", // Session secret
        resave: true,
        saveUninitialized: true
    })
);

app.use(express.json());

// Authentication middleware for /customer/auth routes
app.use("/customer/auth/", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Error logging in, missing username or password" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({ username: username }, 'access', { expiresIn: '1h' });

        // Store access token and username in session
        req.session.authorization = { accessToken, username };

        return res.status(200).json({
            message: "User successfully logged in",
            accessToken: accessToken
        });
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// Register route
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(409).json({ message: "User already exists!" });
        }
    }
    return res.status(400).json({ message: "Unable to register user. Missing username or password." });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
