import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../pages/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
      {location.pathname === '/' && (
        <span className="home-label navbar-center-label">Home Page</span>
      )}
      <div className="nav-links">
        {user && (
          <>
            <button
              onClick={() => {
                const route = getMyPageRoute();
                if (route) navigate(route);
              }}
              className="my-page-btn"
            >
              My Page
            </button>
            <Link to="/my-bookings">
              <button>My Bookings</button>
            </Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
