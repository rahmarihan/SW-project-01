import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const fetchEvents = async () => {
    try {
      // Fetch all events regardless of status
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to fetch events');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
    // Optionally fetch events on mount if you want to show them by default
    // fetchEvents();
  }, []);

  // Handler for the button
  const handleShowAllEvents = () => {
    setShowAllEvents(true);
    fetchEvents();
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleUserDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <button onClick={handleShowAllEvents} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        Show All Events
      </button>

      {showAllEvents && (
        <div>
          <h3 className="text-lg font-semibold mb-2">All Events</h3>
          {events.length === 0 && <p>No events found.</p>}
          {events.map(event => (
            <div key={event._id} className="border p-2 mb-2">
              <p><strong>{event.title}</strong> - Status: {event.status}</p>
              {/* You can add more event details here */}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold mt-6 mb-4">User Management</h2>
      {users.map(user => (
        <div key={user._id} className="border p-2 mb-2">
          <p>{user.name} - {user.email} - Role: {user.role}</p>
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(user._id, e.target.value)}
            className="mr-2"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Event Organizer">Event Organizer</option>
          </select>
          <button onClick={() => handleUserDelete(user._id)} className="text-red-600">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
