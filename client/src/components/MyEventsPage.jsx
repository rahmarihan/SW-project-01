// src/components/MyEventsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../services/api'; // Correct relative path//import './MyEventsPage.css'; // Import your CSS styles
import MyEventCard from './MyEventCard'; // Adjust path if needed
import { data, useNavigate } from 'react-router-dom';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    
    const fetchMyEvents = async () => {
      try {
        const res =  await api.getMyEvents(); // Adjust API endpoint as needed
        console.log('Events fetched:', res);
        setEvents(res.events|| []);
      } catch (err) {
        console.error('Error fetching events:', err.response?.data?.message || err.message);
        alert('Failed to load your events');
        setEvents([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleDeleteSuccess = (deletedId) => {
    setEvents(prev => prev.filter(event => event._id !== deletedId));
  };

  const handleCreateNew = () => {
    navigate('/my-events/create');
  };

  if (loading) return <p>Loading your events...</p>;

  return (
    <div className="my-events-page">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Events</h1>
        <button className="create-btn" onClick={handleCreateNew}>
          + Create New Event
        </button>
      </div>

      {(!events || events.length == 0) ? (
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
    </div>
  );
};

export default MyEventsPage;
