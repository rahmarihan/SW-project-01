import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔹 Step 1: Import this
import { toast } from 'react-toastify';
import api from '../services/api';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 🔹 Step 2: Init navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (step === 1) {
      if (!email || !newPassword) {
        toast.error('Please enter your email and new password');
        setLoading(false);
        return;
      }

      try {
        await api.forgotPassword({ email, newPassword });
        toast.success('OTP sent to your email!');
        setStep(2);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to send OTP');
      } finally {
        setLoading(false);
      }
    } else {
      if (!otp || !newPassword) {
        toast.error('Please enter both OTP and new password');
        setLoading(false);
        return;
      }

      try {
        await api.forgotPassword({ email, otp, newPassword });
        toast.success('Password reset successful!');
        setEmail('');
        setOtp('');
        setNewPassword('');
        setStep(1);

        // 🔹 Step 3: Redirect to login after success
        navigate('/login');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
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
          disabled={step === 2}
        />
      </div>

      {step === 1 && (
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
      )}

      {step === 2 && (
        <>
          <div>
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
            />
          </div>

          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading
          ? 'Processing...'
          : step === 1
          ? 'Send OTP'
          : 'Reset Password'}
      </button>
    </form>
  );
}

export default ForgotPassword;
