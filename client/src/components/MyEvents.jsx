// src/components/MyEvents.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

const MyEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get("/events/my"); // Adjust API endpoint as needed
        setEvents(response.data);
      } catch (error) {
        toast.error("Failed to load your events");
      }
    };

    fetchMyEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((event) => event._id !== id));
      toast.success("Event deleted");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Events</h2>
        <Link
          to="/my-events/create"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Location</th>
              <th className="border border-gray-300 p-2">Tickets</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td className="border border-gray-300 p-2">{event.title}</td>
                <td className="border border-gray-300 p-2">{new Date(event.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2">{event.location}</td>
                <td className="border border-gray-300 p-2">{event.availableTickets}</td>
                <td className="border border-gray-300 p-2">${event.ticketPrice}</td>
                <td className="border border-gray-300 p-2">{event.status}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <Link
                    to={`/my-events/edit/${event._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyEvents;
