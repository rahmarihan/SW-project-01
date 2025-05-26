// src/components/EventAnalytics.jsx
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
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EventAnalytics() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      navigate("/not-authorized");
      return;
    }

    async function fetchAnalytics() {
      try {
        const response = await api.getAnalytics();
        const approvedEvents = response.data.groupedAnalytics.approved || [];
        setEvents(approvedEvents);

        if (approvedEvents.length > 0) {
          const first = approvedEvents[0];
          setSelectedEventId(first.eventId);
          updateChartData(first);
        } else {
          setData(null);
        }
      } catch {
        setError("Failed to load analytics.");
        setData(null);
      }
    }

    fetchAnalytics();
  }, [user, navigate]);

  const updateChartData = (evt) => {
    const booked = evt.tickets.sold || 0;
    const total = evt.tickets.total || 0;
    const available = Math.max(total - booked, 0);
    setData([
      { name: "Booked Tickets", value: booked },
      { name: "Available Tickets", value: available },
    ]);
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    const evt = events.find((ev) => ev.eventId === id);
    if (evt) updateChartData(evt);
  };

  if (!user || user.role !== "organizer") return null;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!data) return <p className="p-4">Loading analytics...</p>;

  return (
    <div className="page-wrapper" style={{ position: 'relative', minHeight: '100vh' }}>
      <main className="content p-6 w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Ticket Analytics</h2>

        <div className="mb-4">
          <label
            htmlFor="event-select"
            className="block mb-1 font-semibold"
          >
            Select Event:
          </label>
          <select
            id="event-select"
            value={selectedEventId}
            onChange={handleSelectChange}
            className="border px-3 py-2 rounded w-full max-w-xs"
          >
            {events.map((ev) => (
              <option key={ev.eventId} value={ev.eventId}>
                {ev.title}
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
            <Tooltip formatter={(val) => [`${val}`, "Tickets"]} />
            <Legend />
            <Bar dataKey="value" className="fill-current text-indigo-500">
              <LabelList dataKey="value" position="insideRight" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </main>
      <button
        onClick={() => navigate('/organizer')}
        className="back-btn"
        style={{
          position: 'fixed',
          right: '2.5rem',
          bottom: '2.5rem',
          background: '#2e41d5',
          color: '#fff',
          border: 'none',
          borderRadius: '50px',
          padding: '0.9em 2em',
          fontSize: '1.1rem',
          fontWeight: 600,
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(44,62,80,0.10)'
        }}
      >
        ← Back
      </button>
    </div>
  );
}
