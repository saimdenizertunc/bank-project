import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="header">
      <div>
        <Link to="/">Home</Link>
        {currentUser ? <Link to="/transfer">Transfer</Link> : null}
        <Link to="/credit">Credit</Link>
      </div>

      <div>
        {currentUser ? (
          <>
            <span className="welcome-text">Welcome, {currentUser.name}!</span>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
