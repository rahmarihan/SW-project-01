import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  if (!user) return <p>Loading...</p>;

  const handleShowEvents = async () => {
    setShowEvents((prev) => !prev);
    if (!showEvents) {
      setLoadingEvents(true);
      try {
        // FIX: Use the admin endpoint!
        const res = await api.get('/events/all');
        // The data is in res.data.data (see your controller)
        setEvents(res.data.data);
      } catch (err) {
        setEvents([]);
        alert('Failed to fetch events');
      } finally {
        setLoadingEvents(false);
      }
    }
  };

  return (
    <div className="page-wrapper">
      <header className="navbar">
        <h1 className="logo">👑 Admin Dashboard</h1>
        <nav className="nav-buttons">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/update-profile')}>Edit Profile</button>
          <button onClick={() => setShowProfile((prev) => !prev)}>
            {showProfile ? 'Hide Profile Details' : 'View Profile Details'}
          </button>
          <button onClick={logout}>Logout</button>
          <button onClick={() => navigate('/admin/events')}>
            View & Manage All Events
          </button>
          <button onClick={() => navigate('/admin/users')}>
            Manage Users
          </button>
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
          </div>
        )}

        {showEvents && (
          <div style={{ marginTop: '2rem' }}>
            <h3>All Events</h3>
            {loadingEvents ? (
              <p>Loading events...</p>
            ) : events.length === 0 ? (
              <p>No events found.</p>
            ) : (
              events.map(event => (
                <div key={event._id} style={{ border: '1px solid #eee', margin: '8px 0', padding: '8px', borderRadius: 6 }}>
                  <strong>{event.title}</strong> — Status: {event.status}
                  {/* Add more event details if needed */}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
