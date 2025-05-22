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
import api from "../../api/api";

const EventAnalytics = ({ eventId }) => {
  const [data, setData] = useState(null);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(`/events/${eventId}/analytics`);
        const booked = response.data.ticketsBooked;
        const available = response.data.totalTickets - booked;
        const title = response.data.title;

        setData([
          { name: "Booked Tickets", value: booked },
          { name: "Available Tickets", value: available },
        ]);
        setEventName(title);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      }
    };

    fetchAnalytics();
  }, [eventId]);

  if (!data) return <p className="p-4">Loading analytics...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Ticket Analytics for: {eventName}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
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
