import React from 'react';
import api from '../services/api'; // Correct relative path//import './MyEventsPage.css'; // Import your CSS styles

import { useNavigate } from 'react-router-dom';

const MyEventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/my-events/edit/${event._id}`, { state: { event } });
  }
 const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.deleteEvent(event._id);
        alert('Event deleted successfully');
        // Optionally, you can trigger a callback to refresh the event list
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  }
  return (
    <div className="border p-4 rounded shadow">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="text-xl font-semibold">{event.title}</h2>
        <span
          className={`status-label status-${event.status}`}
          title={event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
        >
          {event.status === 'approved' && <span role="img" aria-label="approved">✔️</span>}
          {event.status === 'pending' && <span role="img" aria-label="pending">⏳</span>}
          {event.status === 'declined' && <span role="img" aria-label="declined">❌</span>}
          <span style={{ marginLeft: 6, textTransform: 'capitalize' }}>{event.status}</span>
        </span>
      </div>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      <p>Price: ${event.ticketPrice}</p>
      {/* <button onClick={handleEdit} className="mt-2 text-blue-500">
        Edit Event
      </button> */}
      <button onClick={handleDelete} className="mt-2 text-blue-500">
        Delete
      </button>
    </div>
  );
};

export default MyEventCard;
