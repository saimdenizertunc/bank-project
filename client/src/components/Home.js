import React, { useState, useEffect } from "react";
import axios from "axios";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";

function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div style={{margin:"50px"}}>
      <h2>User List</h2>
      <MDBListGroup>
        {users.map((user) => (
          <MDBListGroupItem key={user.id}>
            <strong>{user.name}</strong> - {user.email} - {user.country}
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
    </div>
  );
}

export default Home;
