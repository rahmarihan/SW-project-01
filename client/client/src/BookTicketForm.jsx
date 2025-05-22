// src/components/BookTicketForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const BookTicketForm = ({ eventId, availableTickets }) => {
  const [ticketsToBook, setTicketsToBook] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ticketsToBook < 1 || ticketsToBook > availableTickets) {
      setMessage(`Please enter a valid number of tickets (1 to ${availableTickets}).`);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Replace with your booking API endpoint and payload
      const response = await axios.post(`/api/v1/events/${eventId}/book`, {
        tickets: ticketsToBook,
      });

      setMessage('Booking successful!');
    } catch (error) {
      setMessage('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded bg-gray-50 max-w-sm">
      <h3 className="text-lg font-semibold mb-2">Book Tickets</h3>
      <label className="block mb-2">
        Number of Tickets:
        <input
          type="number"
          min="1"
          max={availableTickets}
          value={ticketsToBook}
          onChange={(e) => setTicketsToBook(Number(e.target.value))}
          className="border p-1 ml-2 w-16"
          disabled={loading}
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Booking...' : 'Book'}
      </button>
      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
    </form>
  );
};

export default BookTicketForm;
