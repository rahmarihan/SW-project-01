import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setFormData({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role
        });
      })
      .catch(() => {
        toast.error('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    axios
      .put(
        '/api/v1/users/me',
        { name: formData.name, email: formData.email },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(() => toast.success('Profile updated'))
      .catch(() => toast.error('Update failed'));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>My Profile</h2>
      <p><strong>Role:</strong> {formData.role}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default ProfilePage;
