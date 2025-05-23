import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../pages/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getMyPageRoute = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'organizer':
        return '/organizer';
      case 'user':
      default:
        return '/my-page';
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🎟️ Eventify</Link>

      <div className="nav-links">
        {!user && (
      <>
        <Link to="/login" className="nav-btn">Login</Link>
        <Link to="/register" className="nav-btn">Register</Link>
      </>
    )}

        {user && (
          <>
            {/* Show My Page button */}
            <button
              onClick={() => {
                const route = getMyPageRoute();
                if (route) navigate(route);
              }}
              className="my-page-btn"
            >
              My Page
            </button>

            {/* Commented out for now, add later if needed */}
            {/* <Link to="/profile">Profile</Link> */}
            {/* {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>} */}
            {/* {user.role === 'organizer' && <Link to="/organizer">My Events</Link>} */}
            {/* {user.role === 'user' && <Link to="/bookings">My Bookings</Link>} */}

            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
