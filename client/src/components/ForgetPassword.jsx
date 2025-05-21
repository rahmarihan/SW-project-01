import React, { useState } from 'react';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with real API call
      // Example: await api.forgotPassword({ email });

      // Simulate API call delay
      await new Promise((r) => setTimeout(r, 1000));

      setLoading(false);
      toast.success('Password reset link sent to your email!');
      setEmail('');
    } catch (err) {
      setLoading(false);
      toast.error(err.message || 'Failed to send reset link');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
}

export default ForgotPassword;
