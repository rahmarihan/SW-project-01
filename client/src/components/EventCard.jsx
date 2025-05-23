//src/components/EventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
//import './EventCard.css'; // optional: for styling

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <div className="event-card" onClick={handleClick}>
    <h3>{event.title}</h3>
    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
    <p><strong>Location:</strong> {event.location}</p>
    <p><strong>Price:</strong> ${event.ticketPrice}</p>
  </div>

  );y
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '16px',
    margin: '12px',
    cursor: 'pointer',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 8px',
  },
  info: {
    margin: '4px 0',
    color: '#333',
  },
};

export default EventCard;
