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
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="content">
        <h2 className="welcome-message">Welcome, {user.name}! 🎉</h2>

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
