import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
//import { useNavigate } from 'react-router-dom';
import '../pages/LoginForm.css'; // Make sure this file includes the layout styles

function LoginForm() {
  const { login } = useAuth();
  //const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleBack = () => navigate('/');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login({ email, password });
    setLoading(false);

    if (result.success && result.token) {
      // Save token to localStorage
      localStorage.setItem('token', result.token);
    }

    if (!result.success) {
      setError(result.message || 'Failed to login');
    }

    // No need to redirect here — it's handled inside login() in AuthContext
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>

          {error && (
            <div className="login-error">
              {error}
              {error.toLowerCase().includes('invalid credentials') && (
                <div className="forgot-password">
                  <a href="/forgetPassword">Forgot your password?</a>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="back-to-home">
          <a href="/">← Back to Home</a>
        </div>

        </form>
      </div>
    </div>
  );
}

export default LoginForm;