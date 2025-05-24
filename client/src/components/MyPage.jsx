import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // added Link & useLocation
import api from '../services/api';
import { toast } from 'react-toastify';
import EventCard from '../components/EventCard'; // ✅ Use EventCard
import EventList from '../components/EventList'; // <-- Add this import
import '../pages/MyPage.css';

function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // get current location

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
           <button onClick={() => navigate('/update-profile')}>
      Edit Profile
           </button>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="content">
        <h2>WELCOME {user.name.toUpperCase()}!</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

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
