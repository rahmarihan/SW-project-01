import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/admin/events');
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

  const handleApproval = async (id, action) => {
    try {
      await api.patch(`/admin/events/${id}/${action}`);
      toast.success(`Event ${action}ed`);
      fetchEvents();
    } catch {
      toast.error('Failed to update event');
    }
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

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Event Management</h2>
      {events.map(event => (
        <div key={event._id} className="border p-2 mb-2">
          <p><strong>{event.title}</strong> - Status: {event.status}</p>
          {event.status === 'Pending' && (
            <>
              <button onClick={() => handleApproval(event._id, 'approve')} className="mr-2 text-green-600">Approve</button>
              <button onClick={() => handleApproval(event._id, 'reject')} className="text-red-600">Reject</button>
            </>
          )}
        </div>
      ))}

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
