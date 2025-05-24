import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const UpdateProfileForm = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and Email are required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.updateProfile(formData);
      setUser(res.data.user);
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3>Update Profile</h3>

      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />

      <label htmlFor="email" style={{ marginTop: 10 }}>Email</label>
      <input
        id="email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />

      <label htmlFor="password" style={{ marginTop: 10 }}>Password</label>
      <input
        id="password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="New Password"
      />

      <label htmlFor="role" style={{ marginTop: 10 }}>Role</label>
      <select
        id="role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
        disabled={user?.role !== 'admin'}  // Disable role select for non-admin users
      >
        <option value="">Select Role</option>
        <option value="user">User</option>
        <option value="organizer">Organizer</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" disabled={loading} style={{ marginTop: 15 }}>
        {loading ? 'Updating...' : 'Update'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: 10 }}>{success}</p>}
    </form>
  );
};

export default UpdateProfileForm;
