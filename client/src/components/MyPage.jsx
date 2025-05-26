import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import EventList from '../components/EventList';
import '../pages/MyPage.css';

function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (showEvents) {
      const fetchEvents = async () => {
        try {
          const response = await api.getApprovedEvents();
          setEvents(response.data || response);
        } catch (error) {
          toast.error("Failed to load events.");
          console.error(error);
        }
      };
      fetchEvents();
    }
  }, [showEvents]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="page-wrapper">
      <header className="navbar">
        <h1 className="logo">😊 My Profile</h1>
        <nav className="nav-buttons">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => setShowEvents(!showEvents)}>
            {showEvents ? 'Hide Events' : 'View Events'}
          </button>
          <button onClick={() => navigate('/update-profile')}>Edit Profile</button>
          <button onClick={() => setShowProfile((prev) => !prev)}>
            {showProfile ? 'Hide Profile Details' : 'View Profile Details'}
          </button>
          <button onClick={() => navigate('/my-bookings')}>My Bookings</button> {/* <-- Add this */}
          <button
            onClick={() => {
              logout();
              toast.success('Logged out successfully');
              navigate('/');
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="content">
        <h2 className="welcome-message">Welcome, {user.name}! 🎉</h2>

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

        {showEvents && (
          <div style={{ marginTop: '2rem' }}>
            <h3>All Events</h3>
            <EventList />
          </div>
        )}
      </main>
    </div>
  );
}

export default MyPage;
