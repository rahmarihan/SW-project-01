import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Unauthorized from './components/Unauthorized';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import MyPage from './components/MyPage';
import AdminPage from './components/AdminPage';
import OrganizerPage from './components/OrganizerPage';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgotPassword';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import MyEvents from './components/MyEvents';
import EventForm from './components/EventForm';
// import EventList from './pages/EventList';
// import AdminDashboard from './pages/AdminDashboard';
// import OrganizerPanel from './pages/OrganizerPanel';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgetPassword" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* User Role Route */}
        <Route
          path="/my-page"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Organizer Route */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerPage />
            </ProtectedRoute>
          }
        />

        {/* Organizer routes */}
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/my-events/create" element={<EventForm />} />
        <Route path="/my-events/edit/:id" element={<EventForm />} />
      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </>
  );
}

export default App;