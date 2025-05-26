import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EventAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      navigate("/not-authorized");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await api.getAnalytics();
        const approvedEvents = response.data.groupedAnalytics.approved || [];

        setEvents(approvedEvents);

        // Select first event by default if available
        if (approvedEvents.length > 0) {
          setSelectedEventId(approvedEvents[0].eventId);
          updateChartData(approvedEvents[0]);
        } else {
          setData(null);
        }
      } catch (err) {
        setError("Failed to load analytics.");
        setData(null);
      }
    };

    fetchAnalytics();
  }, [user, navigate]);

  // Update chart data when event selection changes
  const updateChartData = (event) => {
    const booked = event.tickets.sold || 0;
    const total = event.tickets.total || 0;
    const available = Math.max(total - booked, 0);

    setData([
      { name: "Booked Tickets", value: booked },
      { name: "Available Tickets", value: available },
    ]);
  };

  // Handle dropdown selection change
  const handleSelectChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);

    const event = events.find((ev) => ev.eventId === eventId);
    if (event) {
      updateChartData(event);
    }
  };

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!data) return <p className="p-4">Loading analytics...</p>;

  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Ticket Analytics</h2>

      {/* Dropdown to select event */}
      <div className="mb-4">
        <label htmlFor="event-select" className="block mb-1 font-semibold">
          Select Event:
        </label>
        <select
          id="event-select"
          value={selectedEventId}
          onChange={handleSelectChange}
          className="border px-3 py-2 rounded w-full max-w-xs"
        >
          {events.map((event) => (
            <option key={event.eventId} value={event.eventId}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip formatter={(value) => [`${value}`, "Tickets"]} />
          <Legend />
          <Bar dataKey="value" fill="#8884d8">
            <LabelList dataKey="value" position="insideRight" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventAnalytics;
