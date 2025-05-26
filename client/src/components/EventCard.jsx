//src/components/EventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent card click if you add it back
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="event-card">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="event-card-image"
          onError={e => (e.target.style.display = 'none')}
        />
      )}
      <div className="event-card-title">
        {event.title}
      </div>
      <div className="event-card-body">
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Price:</strong> ${event.ticketPrice}</p>
        <button className="view-details-btn" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;