import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from './AuthContext';  

const Header = () => {
  const { user, setUser } = useContext(AuthContext);  // Destructure user and setUser from the context

  const logout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(null);  // Reset user state
        localStorage.removeItem('token');  // Remove token from localStorage
      } else {
        // Handle logout failure here
      }

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink exact to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/credit">Credit</NavLink>
          </li>
          { user && (
            <li>
              <NavLink to="/transfer">Transfer</NavLink>  {/* Protected Route */}
            </li>
          )}
        </ul>
      </nav>
      { user && <button onClick={logout}>Log Out</button> }
    </header>
  );
};

export default Header;
