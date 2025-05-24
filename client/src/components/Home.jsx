import React from "react";
import EventList from "../components/EventList";
import Footer from './Footer';
import '../pages/Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* NO header here, use global Navbar */}
      <div className="home-container">
        <div className="home-main-content">
          <h1>Welcome to Eventify!</h1>
          <p>
            Discover, create, and manage events with ease.<br />
            Please login or register to get started.
          </p>
        </div>
      </div>

      <EventList />

      <Footer />
    </div>
  );
}
