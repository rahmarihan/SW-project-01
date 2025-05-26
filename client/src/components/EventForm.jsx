import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import '../pages/EventForm.css';

const EventForm = () => {
  const { id } = useParams(); // event id for edit, undefined for create
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    totalTickets: "",  // renamed from availableTickets
    ticketPrice: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      // Fetch existing event data for edit
      const fetchEvent = async () => {
        try {
          const event = await api.getEventDetails(id);
          setFormData({
            title: event.data.title || "",
            date: event.data.date ? event.data.date.split("T")[0] : "", // format for input type=date
            location: event.data.location || "",
            totalTickets: event.data.totalTickets || "", // renamed field here
            ticketPrice: event.data.ticketPrice || "",
            description: event.data.description || "",
          });
        } catch (error) {
          toast.error("Failed to load event details");
        }
      };
      fetchEvent();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: now include totalTickets and ticketPrice
    if (!formData.title || !formData.date || !formData.location || !formData.totalTickets || !formData.ticketPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (id) {
        // Edit event
        await api.updateEvent(id, formData);
        toast.success("Event updated successfully");
      } else {
        // Create event
        await api.createEvent(formData);
        toast.success("Event created successfully");
      }
      navigate("/organizer"); // Redirect organizer to their dashboard
    } catch (error) {
      console.error(error);
      toast.error("Failed to save event");
    }
  };

  return (
    <div className="event-form-container">
      <h2>{id ? "Edit Event" : "Create New Event"}</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <label>
          Title<span style={{ color: '#e74c3c' }}>*</span>:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date<span style={{ color: '#e74c3c' }}>*</span>:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location<span style={{ color: '#e74c3c' }}>*</span>:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Total Tickets<span style={{ color: '#e74c3c' }}>*</span>:
          <input
            type="number"
            name="totalTickets"
            value={formData.totalTickets}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <label>
          Ticket Price ($)<span style={{ color: '#e74c3c' }}>*</span>:
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </label>

        <button type="submit">
          {id ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
