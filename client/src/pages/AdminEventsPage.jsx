import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminEventsPage = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchEvents = () => {
    axios
      .get('/api/v1/events', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setEvents(res.data.events))
      .catch(() => toast.error('Failed to fetch events'));
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const handleStatusChange = (id, status) => {
    axios
      .put(
        `/api/v1/events/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success(`Event ${status}`);
        fetchEvents();
      })
      .catch(() => toast.error('Failed to update status'));
  };

  const filteredEvents = events.filter((e) =>
    filter === 'all' ? true : e.status === filter
  );

  return (
    <div className="container">
      <h2>All Events</h2>

      <div>
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      <table border="1" cellPadding="10" cellSpacing="0">
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
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{event.status}</td>
              <td>{event.organizer?.name || 'N/A'}</td>
              <td>
                {event.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatusChange(event._id, 'approved')}>
                      Approve
                    </button>
                    <button onClick={() => handleStatusChange(event._id, 'declined')}>
                      Decline
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEventsPage;
