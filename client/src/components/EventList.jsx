import React, { useEffect, useState, useMemo } from "react";
import EventCard from "./EventCard";
import api from "../services/api";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.getApprovedEvents();
        const eventsArray = response.data || response;
        setEvents(eventsArray);
      } catch (error) {
        toast.error("Failed to load events.");
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    if (search.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (locationFilter.trim()) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(event =>
        new Date(event.date).toDateString() === new Date(dateFilter).toDateString()
      );
    }

    return filtered;
  }, [search, locationFilter, dateFilter, events]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Browse Events</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full sm:w-1/3"
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border rounded p-2 w-full sm:w-1/3"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded p-2 w-full sm:w-1/3"
        />
      </div>

      {/* Event Cards */}
      {filteredEvents.length === 0 ? (
        <p className="text-gray-600">No events found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredEvents.map((event, index) => {
            console.log('Event in map:', event);
            const key = event.id || `${event.title}-${index}`;
            return (
              <Link
                key={key}
                to={`/events/${event.id}`}
                state={{ from: location.pathname }}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <EventCard event={event} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
