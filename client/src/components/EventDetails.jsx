import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../pages/event.css'; // Make sure this file includes the layout styles

// Book ticket form component
function BookTicketForm({ eventId, onBookingSuccess }) {
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/events/${eventId}/book', {
        ticketsToBook: tickets,
      });
      alert(res.data.message);
      onBookingSuccess(res.data.remainingTickets);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <label>
        Number of Tickets:{' '}
        <input
          type="number"
          min="1"
          value={tickets}
          onChange={(e) => setTickets(parseInt(e.target.value, 10) || 1)}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Tickets'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventDetails = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.data || res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details');
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

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!event) return <p>No event found</p>;

  return (
    <div className="container">
      <div className="event-details">
        <h1>{event.title}</h1>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Ticket Price:</strong> ${event.ticketPrice || event.price}</p>
        <p><strong>Available Tickets:</strong> {event.availableTickets}</p>

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
      </div>
    </div>
  );
}
