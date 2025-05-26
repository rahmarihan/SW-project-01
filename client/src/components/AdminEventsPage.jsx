import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../pages/AdminEventPage.css';

const AdminEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchEvents = () => {
    api
      .getAllEvents()
      .then((res) => setEvents(res.data.data))
      .catch(() => {
        setEvents([]);
        toast.error('Failed to fetch events');
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStatusChange = (id, status) => {
    api
      .updateEventStatus(id, status)
      .then(() => {
        toast.success(`Event ${status}`);
        fetchEvents();
      })
      .catch(() => toast.error('Failed to update status'));
  };

  const filteredEvents = Array.isArray(events)
    ? events.filter((e) => filter === 'all' ? true : e.status === filter)
    : [];

  return (
    <div className="page-bg">
      <div className="admin-events-container">
        <h2>All Events</h2>
        <div>
          <label htmlFor="event-filter" style={{ color: "#fff" }}>Filter: </label>
          <select
            id="event-filter"
            name="event-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        <table className="admin-events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Organizer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td className={`status-${event.status}`}>{event.status}</td>
                <td>{event.organizer?.name || 'N/A'}</td>
                <td>
                  {event.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve"
                        onClick={() => handleStatusChange(event.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="action-btn decline"
                        onClick={() => handleStatusChange(event.id, 'declined')}
                      >
                        Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="back-btn"
          onClick={() => navigate('/admin')}
        >
          ← Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminEventsPage;
