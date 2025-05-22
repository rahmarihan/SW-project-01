import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login({ email, password });
    setLoading(false);

    if (result.success) {
      navigate('/'); // redirect to home or dashboard
    } else {
      setError(result.message || 'Failed to login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
          {error.toLowerCase().includes('invalid credentials') && (
            <div style={{ marginTop: '5px' }}>
              <a href="/forgetPassword" style={{ color: 'blue', textDecoration: 'underline' }}>
                Forgot your password?
              </a>
            </div>
          )}
        </div>
      )}

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
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
