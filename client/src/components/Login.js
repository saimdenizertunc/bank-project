import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirectToHome, setRedirectToHome] = useState(false);
  const auth = useAuth();

  // Check if the user is already logged in
  useEffect(() => {
    if (auth.user) {
      console.log("User is already logged in");
      setRedirectToHome(true);
    }
  }, [auth.user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await auth.login(email, password);
    if (result.success) {
      console.log("Login successful");
      setRedirectToHome(true);
    } else {
      setError(result.message);
    }
  };

  if (redirectToHome) {
    
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={handleLogin}>
      <MDBContainer className="my-2 ">
        <MDBCard>
          <MDBRow className="g-1 d-flex flex-column align-items-center justify-content-center">
            <MDBCol md="4" className="d-flex align-items-center justify-content-center">
              <MDBCardImage src={logo} alt="logo" className="rounded-t-5 rounded-tr-lg-0" fluid />
            </MDBCol>
            <MDBCol md="4">
              <MDBCardBody>
                {error && <div className="error-message">{error}</div>}
                <MDBInput
                  wrapperClass="mb-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email address"
                  id="form1"
                  type="email"
                />
                <MDBInput
                  wrapperClass="mb-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  id="form2"
                  type="password"
                />
                <MDBBtn className="mb-4 w-100" type="submit">Log in</MDBBtn>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </form>
  );
}

export default Login;
