import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';  // Import AuthProvider
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import MyEvents from './components/MyEvents';
import EventForm from './components/EventForm';

function App() {
  return (
    <AuthProvider> {/* Wrap entire app with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* Organizer routes */}
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/my-events/create" element={<EventForm />} />
          <Route path="/my-events/edit/:id" element={<EventForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
