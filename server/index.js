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
  res.json(users);
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

