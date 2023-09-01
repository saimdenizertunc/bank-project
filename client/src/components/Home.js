import React, { useState, useEffect } from "react";
import axios from "axios";
import './Home.css';
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";

function Home() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      // Reset to original users list if search term is empty
      axios
        .get("http://localhost:5000/api/users")
        .then((response) => {
          setUsers(response.data.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    } else {
      axios
        .get(`http://localhost:5000/api/findUsersByName?name=${e.target.value}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  };

  return (
    <div className="home-container">
    <h2>User List</h2>
    <input
      type="text"
      className="search-input"
      placeholder="Search by name..."
      value={searchTerm}
      onChange={handleSearch}
    />
    <div className="user-list">
      {Array.isArray(users) && users.map((user) => (
        <div className="user-item" key={user.id}>
          <strong>{user.name}</strong> - {user.email} - {user.country} - Limit: {user.limit}
        </div>
      ))}
    </div>
  </div>
    
  );
}

export default Home;
