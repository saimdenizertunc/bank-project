import React, { useState, useEffect } from "react";
import axios from "axios";
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
    <div style={{ margin: "50px" }}>
      <h2>User List</h2>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <MDBListGroup>
        {Array.isArray(users) && users.map((user) => (
          <MDBListGroupItem key={user.id}>
            <strong>{user.name}</strong> - {user.email} - {user.country}
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
    </div>
  );
}

export default Home;
