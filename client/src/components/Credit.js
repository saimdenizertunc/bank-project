import React, { useState, useEffect } from "react";
import axios from "axios";
import './Credit.css'; // Import the new CSS file
import Header from "./Header";

function Credit() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/checkBalance")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
    <Header/>
    
    <div className="credit-container">
      <h2>Credit Page</h2>
      <div className="user-list">
        {currentUsers.map((user) => (
          <div
            className={`user-item ${user.currentBalance < 0 ? "red" : user.currentBalance > user.limit ? "red" : user.currentBalance > 0 ? "green" : "black"}`}
            key={user.id}
          >
            <strong>{user.name}</strong> - Balance: {user.currentBalance}
          </div>
        ))}
      </div>
      <div className="pagination">
        {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map((number) => (
          <button key={number + 1} onClick={() => paginate(number + 1)}>
            {number + 1}
          </button>
        ))}
      </div>
    </div>
    </>
  );
}

export default Credit;
