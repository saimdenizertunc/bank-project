const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

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

  if (filteredUsers.length > 0) {
    res.json(filteredUsers);
  } else {
    res.status(404).json({ message: "No users found" });
  }
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

// Login
app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, user: user });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Yanlış email veya şifre" });
  }
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

