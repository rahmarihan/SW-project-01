import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function OrganizerPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  if (!user || user.role !== 'organizer') return null;

  const handleViewAnalytics = () => {
    navigate('/organizer/analytics');
  };
  const handleViewEvents = () => {
    navigate('/organizer/my-events');
  };
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

          <button onClick={handleViewAnalytics} className="btn-primary mt-4">
            View Event Analytics
          </button>
          <button onClick={handleViewEvents} className="btn-primary mt-4">
            View Events
          </button>
          <button onClick={() => navigate('/my-events/create')} className="btn-primary mt-4">
            + Create Event
          </button>
          <button onClick={logout}>Logout</button>

        </nav>
      </header>

      <main className="content">
        <h2>WELCOME {user.name.toUpperCase()}!</h2>

        {showProfile && (
          <div className="profile-details-card">
            <h3>Profile Details</h3>
            <div className="profile-details-list">
              <div><span className="profile-label">ID:</span> <span className="profile-value">{user.id || user._id}</span></div>
              <div><span className="profile-label">Name:</span> <span className="profile-value">{user.name}</span></div>
              <div><span className="profile-label">Email:</span> <span className="profile-value">{user.email}</span></div>
              <div><span className="profile-label">Role:</span> <span className="profile-value">{user.role}</span></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrganizerPage;
