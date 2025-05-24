import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../pages/event.css'; // Make sure this file includes the layout styles
import api from '../services/api';
import BookTicketForm from "./BookTicketForm";

export default function EventDetails() {
  const { id } = useParams();
  console.log("Event ID from URL params:", id);
  console.log('Params:', useParams()); // Debugging line

  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventDetails = async () => {
    try {
      const res = await api.getEventDetails(id);
      console.log('API Response:', res.data); // Debug log

      // Adapt this based on your API's actual response shape:
      // Try res.data.data, res.data.event, or res.data itself
      const eventData = res.data.data || res.data.event || res.data;
      console.log("FULL EVENT RESPONSE:", res.data);

      if (!eventData) {
        throw new Error('No event data found');
      }
      setEvent(eventData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleBookingSuccess = (newRemainingTickets) => {
    setEvent((prev) => ({
      ...prev,
      availableTickets: newRemainingTickets,
    }));
  };

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1); // fallback to browser back
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!event) return <p>No event found</p>;

  return (
    <div className="container">
      <div className="event-details">
        <h1>{event.title || event.name || 'Untitled Event'}</h1>
        <p>
          <strong>Date:</strong>{' '}
          {event.date ? new Date(event.date).toLocaleString() : 'N/A'}
        </p>
        <p><strong>Location:</strong> {event.location || 'N/A'}</p>
        <p><strong>Description:</strong> {event.description || 'No description available'}</p>
        <p><strong>Ticket Price:</strong> ${event.ticketPrice ?? event.price ?? 'N/A'}</p>
        <p><strong>Available Tickets:</strong> {event.availableTickets ?? 'N/A'}</p>

        <button onClick={handleBack} className="back-button">← Back</button>

        {user ? (
          user.role === 'user' ? (
            <BookTicketForm eventId={id} onBookingSuccess={handleBookingSuccess} />
          ) : (
            <p>Only users can book tickets.</p>
          )
        ) : (
          <p>
            Please <Link to="/login">log in</Link> to book tickets.
          </p>
        )}

        {/* Debug: Show raw event data */}
        {/* <pre>{JSON.stringify(event, null, 2)}</pre> */}
      </div>
    </div>
  );
}
