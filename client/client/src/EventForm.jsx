// src/components/EventForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

const EventForm = () => {
  const { id } = useParams(); // event id for edit, undefined for create
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    availableTickets: "",
    ticketPrice: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      // Fetch existing event data for edit
      const fetchEvent = async () => {
        try {
          const response = await api.get(`/events/${id}`);
          const event = response.data;
          setFormData({
            title: event.title || "",
            date: event.date ? event.date.split("T")[0] : "", // format for input type=date
            location: event.location || "",
            availableTickets: event.availableTickets || "",
            ticketPrice: event.ticketPrice || "",
            description: event.description || "",
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

    // Basic validation
    if (!formData.title || !formData.date || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (id) {
        // Edit event
        await api.put(`/events/${id}`, formData);
        toast.success("Event updated successfully");
      } else {
        // Create event
        await api.post("/events", formData);
        toast.success("Event created successfully");
      }
      navigate("/my-events"); // Redirect organizer to their events list
    } catch (error) {
      console.error(error);
      toast.error("Failed to save event");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit Event" : "Create New Event"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Title<span className="text-red-500">*</span>:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Date<span className="text-red-500">*</span>:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Location<span className="text-red-500">*</span>:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Available Tickets:
          <input
            type="number"
            name="availableTickets"
            value={formData.availableTickets}
            onChange={handleChange}
            min="0"
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Ticket Price ($):
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="border p-2 rounded w-full"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {id ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
