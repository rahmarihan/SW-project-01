import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MyEventCard from './MyEventCard';

export default function MyEventsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await api.getMyEvents();
        console.log('Events fetched:', res);
        setEvents(res.events || []);
      } catch (err) {
        console.error('Error fetching events:', err.response?.data?.message || err.message);
        alert('Failed to load your events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleDeleteSuccess = (deletedId) => {
    setEvents(prev => prev.filter(e => e._id !== deletedId));
  };

  const handleCreateNew = () => navigate('/my-events/create');
  const handleGoBack = () => navigate(-1);
  const handleViewAnalytics = () => navigate('/organizer/analytics');
  const handleViewEvents = () => navigate('/organizer/my-events');

  if (!user || user.role !== 'organizer') return null;
  if (loading) return <p>Loading your events...</p>;

  return (
    <div className="page-wrapper">
      <header className="navbar">
        <h1 className="logo">🎤 My Events Dashboard</h1>
        <nav className="nav-buttons">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/update-profile')}>Edit Profile</button>
          <button onClick={() => setShowProfile(prev => !prev)}>
            {showProfile ? 'Hide Profile Details' : 'View Profile Details'}
          </button>
          <button onClick={handleViewAnalytics} className="btn-primary">
            View Event Analytics
          </button>
          <button onClick={handleViewEvents} className="btn-primary">
            View Events
          </button>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="content">
        <h2>WELCOME {user.name.toUpperCase()}!</h2>
        {showProfile && (
          <div className="card p-4 mt-4 rounded-lg shadow-sm">
            <h3>Profile Details</h3>
            <p><strong>ID:</strong> {user.id || user._id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-6 mb-4">
          <h1 className="text-2xl font-bold">My Events</h1>
          <div>
            <button onClick={handleCreateNew} className="btn-primary mr-2">
              + Create New Event
            </button>
            <button onClick={handleGoBack} className="btn-secondary">
              Back
            </button>
          </div>
        </div>

        {events.length === 0 ? (
          <p>You haven’t created any events yet.</p>
        ) : (
          <div className="grid gap-4">
            {events.map(event => (
              <MyEventCard
                key={event._id}
                event={event}
                onDeleteSuccess={handleDeleteSuccess}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
