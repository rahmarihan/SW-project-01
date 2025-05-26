import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import '../pages/Bookings.css';

const UserBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await api.getUserBookings();
        setBookings(data);
      } catch (err) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.cancelBooking(bookingId);
      setBookings(bookings.filter(b => b._id !== bookingId));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error('Cancellation failed');
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="page-wrapper">
      <div className="user-bookings">
        <h2>My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="no-bookings">You have no bookings yet.</p>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-info">
                  <h3>
                    <Link to={`/bookings/${booking._id}`}>
                      {booking.event.title}
                    </Link>
                  </h3>
                  <p>Date: {new Date(booking.event.date).toLocaleDateString()}</p>
                  <p>Tickets: {booking.numberOfTickets}</p>
                  <p>Total: ${booking.totalPrice.toFixed(2)}</p>
                  <p>Status: <span className={`status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span></p>
                </div>
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="cancel-btn"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Fixed Back Button */}
      <button
        className="back-btn"
        onClick={() => window.history.back()}
      >
        ← Back to My Page
      </button>
    </div>
  );
};

export default UserBookingsPage;