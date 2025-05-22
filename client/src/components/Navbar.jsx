import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // adjust path if needed
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">🎟️ Eventify</Link>

      <div className="space-x-4">
        {/* Show when not logged in */}
        {!user && (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}

        {/* Common links when logged in */}
        {user && (
          <>
            <Link to="/profile" className="hover:underline">Profile</Link>

            {/* Role-specific links */}
            {user.role === 'admin' && (
              <Link to="/admin" className="hover:underline">Admin Panel</Link>
            )}
            {user.role === 'organizer' && (
              <Link to="/organizer" className="hover:underline">My Events</Link>
            )}
            {user.role === 'user' && (
              <Link to="/bookings" className="hover:underline">My Bookings</Link>
            )}

            <button onClick={handleLogout} className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
