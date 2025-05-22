import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// Replace this with your actual AuthContext or however you track logged-in user
import { AuthContext } from '../context/AuthContext'; 

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
      const res = await axios.post(`/api/v1/events/${eventId}/book`, {
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
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <label>
        Number of Tickets:{' '}
        <input
          type="number"
          min="1"
          value={tickets}
          onChange={(e) => setTickets(parseInt(e.target.value, 10) || 1)}
          style={{ width: '50px' }}
        />
      </label>
      <button type="submit" disabled={loading} style={{ marginLeft: '1rem' }}>
        {loading ? 'Booking...' : 'Book Tickets'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </form>
  );
}

// Main EventDetails component
export default function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext); // User info and login state
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event details from backend
  const fetchEventDetails = async () => {
    try {
      const res = await axios.get(`/api/v1/events/${id}`);
      // Assuming backend sends event data under res.data.data
      setEvent(res.data.data || res.data); // fallback to res.data if structure differs
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  // Update available tickets after successful booking
  const handleBookingSuccess = (newRemainingTickets) => {
    setEvent((prev) => ({
      ...prev,
      availableTickets: newRemainingTickets,
    }));
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!event) return <p>No event found</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{event.title}</h1>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Description:</strong> {event.description}
      </p>
      <p>
        <strong>Ticket Price:</strong> ${event.ticketPrice || event.price}
      </p>
      <p>
        <strong>Available Tickets:</strong> {event.availableTickets}
      </p>

      {user ? (
        <BookTicketForm eventId={id} onBookingSuccess={handleBookingSuccess} />
      ) : (
        <p>Please log in to book tickets.</p>
      )}
    </div>
  );
}
