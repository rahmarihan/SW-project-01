// src/components/BookTicketForm.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify'; // <-- import toast

const BookTicketForm = ({ eventId, availableTickets, onBookingSuccess, ticketPrice }) => {
  const [ticketsToBook, setTicketsToBook] = useState(1);
  const [loading, setLoading] = useState(false);

  // Calculate total price
  const totalPrice = (Number(ticketPrice) * Number(ticketsToBook) || 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ticketsToBook < 1 || ticketsToBook > availableTickets) {
      toast.error(`Please enter a valid number of tickets (1 to ${availableTickets}).`);
      return;
    }

    setLoading(true);

    try {
      const response = await api.bookTicket(eventId, ticketsToBook);

      toast.success('Booking successful!');
      if (onBookingSuccess) {
        const newAvailable =
          response.data?.booking?.event?.remainingTickets !== undefined
            ? response.data.booking.event.remainingTickets
            : availableTickets - ticketsToBook;
        onBookingSuccess(newAvailable);
      }
      setTicketsToBook(1);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Booking failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 border rounded bg-gray-50 max-w-sm booking-form"
      style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', color: '#2e41d5', fontWeight: 600 }}>
        Number of Tickets:
        <input
          type="number"
          min="1"
          max={availableTickets}
          value={ticketsToBook}
          onChange={(e) => setTicketsToBook(Number(e.target.value))}
          className="border p-1 ml-2 w-16"
          disabled={loading}
          style={{ marginLeft: '0.5rem' }}
        />
      </span>
      <span style={{ fontWeight: 600, color: '#2e41d5', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
        Total:&nbsp;
        <span style={{ fontWeight: 700, color: '#2e41d5', marginLeft: '2px' }}>${totalPrice}</span>
      </span>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        style={{ marginLeft: '0.5rem' }}
      >
        {loading ? 'Booking...' : 'Book'}
      </button>
    </form>
  );
};

export default BookTicketForm;


