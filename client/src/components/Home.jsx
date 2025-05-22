import React from "react";
import { Link } from "react-router-dom"; // ⬅️ To navigate to /login and /register
import './Home.css'; // ⬅️ Import CSS

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Eventify!</h1>
      <p>
        Discover, create, and manage events with ease.<br />
        Please login or register to get started.
      </p>
      <div className="home-buttons">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
