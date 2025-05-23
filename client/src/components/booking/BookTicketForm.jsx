import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../../services/bookingService';
import { toast } from 'react-toastify';

const BookTicketForm = ({ event, refreshEvent }) => {
  const { id: eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total price
  const totalPrice = (event.price * quantity).toFixed(2);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    
    try {
      // Use bookingService instead of direct axios call
      await bookingService.bookTickets(eventId, quantity, user._id);
      toast.success(`Successfully booked ${quantity} ticket(s)!`);
      refreshEvent(); // Refresh parent component
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quantity changes with validation
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const newQuantity = Math.max(1, Math.min(value, event.ticketsAvailable));
    setQuantity(newQuantity);
  };

  // Render availability message
  const renderAvailability = () => {
    if (event.ticketsAvailable > 5) {
      return `${event.ticketsAvailable} tickets available`;
    } else if (event.ticketsAvailable === 1) {
      return 'Only 1 ticket left!';
    } else {
      return `Only ${event.ticketsAvailable} tickets left!`;
    }
  };

  return (
    <div className="book-ticket-form">
      <h3>Book Tickets</h3>
      
      {event.ticketsAvailable > 0 ? (
        <div className="booking-available">
          <p className="availability">
            {renderAvailability()}
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label>
                Quantity:
                <input
                  type="number"
                  min="1"
                  max={event.ticketsAvailable}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={isLoading}
                />
              </label>
            </div>
            
            <div className="price-details">
              <p>Price per ticket: <strong>${event.price.toFixed(2)}</strong></p>
              <p className="total">Total: <strong>${totalPrice}</strong></p>
            </div>
            
            <button 
              type="submit" 
              className="btn-book"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Book Now'}
            </button>
          </form>
        </div>
      ) : (
        <p className="sold-out">Sold Out</p>
      )}
    </div>
  );
};

export default BookTicketForm;