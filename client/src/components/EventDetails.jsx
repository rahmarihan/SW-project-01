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
    <div className="page-wrapper">
      <div className="event-details-wrapper">
        <div className="event-details">
          <h1 className="event-title">{event.title || event.name || 'Untitled Event'}</h1>
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="event-details-image"
              style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '1.5rem' }}
              onError={e => (e.target.style.display = 'none')}
            />
          )}
          <div className="event-info-grid">
            <div className="event-info-row">
              <span className="event-info-label">Date:</span>
              <span className="event-info-value">
                {event.date ? new Date(event.date).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="event-info-row">
              <span className="event-info-label">Location:</span>
              <span className="event-info-value">{event.location || 'N/A'}</span>
            </div>
            <div className="event-info-row">
              <span className="event-info-label">Description:</span>
              <span className="event-info-value">{event.description || 'No description available'}</span>
            </div>
            <div className="event-info-row">
              <span className="event-info-label">Ticket Price:</span>
              <span className="event-info-value">${event.ticketPrice ?? event.price ?? 'N/A'}</span>
            </div>
            <div className="event-info-row">
              <span className="event-info-label">Available Tickets:</span>
              <span className="event-info-value">{event.availableTickets ?? 'N/A'}</span>
            </div>
          </div>

          {/* Booking section */}
          <div className="event-actions-row">
            {user ? (
              user.role === 'user' ? (
                <BookTicketForm
                  eventId={id}
                  availableTickets={event.availableTickets}
                  ticketPrice={event.ticketPrice ?? event.price ?? 0}
                  onBookingSuccess={handleBookingSuccess}
                />
              ) : (
                <p className="only-user-msg">Only users can book tickets.</p>
              )
            ) : (
              <div className="login-alert">
                <span>🔒</span>
                <span>
                  Please <Link to="/login">log in</Link> to book tickets.
                </span>
              </div>
            )}
            <button
              type="button"
              className="back-button"
              onClick={handleBack}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}
            >
              <span style={{ fontSize: '1.2em' }}>←</span>
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}