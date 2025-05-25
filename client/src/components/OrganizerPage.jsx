import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function OrganizerPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="page-wrapper">
      <header className="navbar">
        <h1 className="logo">🎤 Organizer Dashboard</h1>
        <nav className="nav-buttons">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/update-profile')}>Edit Profile</button>
          <button onClick={() => setShowProfile((prev) => !prev)}>
            {showProfile ? 'Hide Profile Details' : 'View Profile Details'}
          </button>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="content">
        <h2>WELCOME {user.name.toUpperCase()}!</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        {showProfile && (
          <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: 8 }}>
            <h3>Profile Details</h3>
            <p><strong>ID:</strong> {user.id || user._id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {/* Add more fields if available */}
          </div>
        )}
      </main>
    </div>
  );
}

export default OrganizerPage;
