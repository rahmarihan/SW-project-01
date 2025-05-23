import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const UserBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`/api/bookings/user/${user._id}`);
        setBookings(response.data);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user._id]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      toast.success('Booking cancelled');
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    }
  };

  if (isLoading) return <div>Loading your bookings...</div>;

  return (
    <div className="user-bookings">
      <h2>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <p>You haven't made any bookings yet.</p>
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
                <p>Location: {booking.event.location}</p>
                <p>Quantity: {booking.quantity}</p>
                <p>Total Paid: ${(booking.quantity * booking.event.price).toFixed(2)}</p>
                <p>Status: {booking.status}</p>
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