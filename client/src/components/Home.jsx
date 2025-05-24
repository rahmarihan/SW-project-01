import React from "react";
import { useLocation } from 'react-router-dom';
import EventList from "../components/EventList";
import '../pages/Home.css';

export default function Home() {
  const location = useLocation();

  return (
    <div className="home-page">
      <EventList />
    </div>
  );
}
