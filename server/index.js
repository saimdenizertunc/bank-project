const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const fs = require("fs");
const { waitForDebugger } = require("inspector");

let users = [];
let transactions = [];

fs.readFile("user.json", (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
});

fs.readFile("user-transaction.json", (err, data) => {
  if (err) throw err;
  transactions = JSON.parse(data);
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  console.log("Received token:", token);
  
  try {
    const decoded = jwt.verify(token, 'denizertunc');
    console.log("Decoded token:", decoded);
    req.user = users.find(u => u.id === decoded.id);
    next();
  } catch (error) {
    console.log("Token verification failed:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Calculate Balance
const calculateUserBalance = (userId) => {
  let currentBalance = 0;
  transactions.forEach((transaction) => {
    if (transaction.senderId === userId) {
      currentBalance -= transaction.amount;
    }
    if (transaction.recipientId === userId) {
      currentBalance += transaction.amount;
    }
  });
  return currentBalance;
};



// Login
app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id }, 'denizertunc', { expiresIn: '1h' });
    console.log(token)
    res.json({ success: true, user: user, token });
  } else {
    res.status(401).json({ success: false, message: "Yanlış email veya şifre" });
  }
});


// Get All Users
app.get("/api/users", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const paginatedUsers = users.slice(startIndex, endIndex);

  res.json({
    page,
    pageSize,
    total: users.length,
    data: paginatedUsers,
  });
});

// Get a single user by ID
app.get("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10); // Convert the ID to a number
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Find users by name
app.get("/api/findUsersByName", (req, res) => {
  const nameQuery = req.query.name || ""; // Default to an empty string if no query is provided
  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(nameQuery.toLowerCase()));

  res.json(filteredUsers);
});

// Get the sum of credit limits grouped by country
app.get("/api/creditByCountry", (req, res) => {
  const creditByCountry = {};

  users.forEach((user) => {
    const country = user.country;
    const creditLimit = user.limit; 

    if (creditByCountry[country]) {
      creditByCountry[country] += creditLimit;
    } else {
      creditByCountry[country] = creditLimit;
    }
  });

  res.json(creditByCountry);
});

// Get the balance of all users
app.get("/api/checkBalance", (req, res) => {
  const userBalances = users.map((user) => {
    const currentBalance = calculateUserBalance(user.id);
    return { ...user, currentBalance };
  });

  res.json(userBalances);
});

// Get users who have exceeded their credit limit
app.get("/api/usersExceededCreditLimit", (req, res) => {
  const usersExceededCreditLimit = [];

  users.forEach((user) => {
    const currentBalance = calculateUserBalance(user.id);

    if (currentBalance > user.limit) {
      usersExceededCreditLimit.push({ ...user, currentBalance });
    }
  });

  res.json(usersExceededCreditLimit);
});

// Transfer Balance (Protected Route)
app.post("/api/transferBalance", isAuthenticated, (req, res) => {
  const { recipientId, amount } = req.body;

  if (!recipientId || !amount) {
    return res.status(400).json({ message: "Recipient ID and amount are required." });
  }

  const sender = req.user;
  const recipient = users.find((u) => u.id === parseInt(recipientId));

  if (!recipient) {
    return res.status(404).json({ message: "Recipient not found." });
  }

  // Calculate sender's current balance
  let senderCurrentBalance = 0;
  transactions.forEach((transaction) => {
    if (transaction.senderId === sender.id) {
      senderCurrentBalance -= transaction.amount;
    }
    if (transaction.recipientId === sender.id) {
      senderCurrentBalance += transaction.amount;
    }
  });

  if (senderCurrentBalance - amount < -sender.limit) {
    return res.status(403).json({ message: "Transaction exceeds credit limit." });
  }

  // Perform the transfer
  const newTransaction = {
    senderId: sender.id,
    recipientId: recipient.id,
    amount,
  };
  

  transactions.push(newTransaction);

  // Write transactions back to 'user-transaction.json'
  fs.writeFileSync('user-transaction.json', JSON.stringify(transactions));

  return res.status(200).json({ message: "Transfer successful.", newTransaction });
});




// Logout
app.post("/api/logout", (req, res) => {
  const userId = req.body.userId;
  const user = users.find((u) => u.id == userId);
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

