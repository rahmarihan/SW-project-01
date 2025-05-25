import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'react-toastify';

const BookingDetails = () => {
  const { id } = useParams();
  
  const { data: booking, isLoading, error } = useQuery(
    ['booking', id],
    () => api.getUserBookings(id)
  );

  if (isLoading) return <div>Loading booking details...</div>;
  if (error) {
    toast.error('Failed to load booking details');
    return <div>Error loading booking</div>;
  }

  return (
    <div className="booking-details">
      <h2>Booking Details</h2>
      
      <div className="booking-info">
        <h3>{booking.event.title}</h3>
        <p><strong>Booking ID:</strong> {booking._id}</p>
        <p><strong>Date:</strong> {new Date(booking.event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> {booking.event.location}</p>
        <p><strong>Tickets:</strong> {booking.quantity}</p>
        <p><strong>Price per ticket:</strong> ${booking.event.price.toFixed(2)}</p>
        <p><strong>Total paid:</strong> ${(booking.quantity * booking.event.price).toFixed(2)}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`status-${booking.status.toLowerCase()}`}>
            {booking.status}
          </span>
        </p>
        <p><strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default BookingDetails;