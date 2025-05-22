import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../pages/ForgetPassword.css'; // Adjust the path if needed
import api from '../services/api';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate('/login');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="forgot-password-page">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Forgot Password</h2>

        <div className="form-group">
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
          <div className="form-group">
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
            <div className="form-group">
              <label>OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
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
    </div>
  );
}

export default ForgotPassword;
