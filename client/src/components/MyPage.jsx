import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../pages/MyPage.css'; // your CSS for normal page layout

function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="page-wrapper">
      <header className="navbar">
        <h1 className="logo">My Website</h1>
        <nav className="nav-buttons">
          <button onClick={() => navigate('/update-profile')}>Update Profile</button>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="content">
        <h2>Welcome, {user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </main>
    </div>
  );
}

export default MyPage;
