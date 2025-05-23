import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import bookingService from 'C:\Users\regal\Desktop\SW PROJ\SW-project-01\client\src\services\bookingService.js';

const UserBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingService.getUserBookings(user._id);
        setBookings(data);
      } catch (err) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [user._id]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId);
      setBookings(bookings.filter(b => b._id !== bookingId));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error('Cancellation failed');
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
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
                  <Link to={`/events/${booking.event._id}`}>
                    {booking.event.title}
                  </Link>
                </h3>
                <p>Date: {new Date(booking.event.date).toLocaleDateString()}</p>
                <p>Tickets: {booking.quantity}</p>
                <p>Total: ${(booking.quantity * booking.event.price).toFixed(2)}</p>
                <p>Status: <span className={`status-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span></p>
              </div>

              {booking.status === 'Confirmed' && (
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
  );
};

export default UserBookingsPage;
