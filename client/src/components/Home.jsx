// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Footer from './Footer';
import EventList from "../components/EventList"; // 👈 Import EventList
import '../pages/Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="logo">🎟️ Eventify</div>
        <nav className="home-nav">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>

      <div className="home-container">
        <div className="home-main-content">
          <h1>Welcome to Eventify!</h1>
          <p>
            Discover, create, and manage events with ease.<br />
            Please login or register to get started.
          </p>
        </div>
      </div>

      {/* Add EventList here */}
      <EventList />

      <Footer />
    </div>
  );
}
