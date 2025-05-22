import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 

function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (password !== confirmPassword) {
    setError("Passwords don't match");
    return;
  }

  setLoading(true);

  try {
    // ✅ Real API call to your backend
    await api.register({ name, email, role, password });

    setLoading(false);
    navigate('/login');
  } catch (err) {
    setLoading(false);
    setError(err.response?.data?.message || 'Registration failed');
  }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Role:</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="User">User</option>
          <option value="Organizer">Organizer</option>
        </select>
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

export default RegisterForm;
