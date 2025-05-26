import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Unauthorized from './components/Unauthorized';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgetPassword';
import MyPage from './components/MyPage';
import AdminPage from './components/AdminPage';
import OrganizerPage from './components/OrganizerPage';
import EventDetails from './components/EventDetails';

import EventAnalytics from './components/EventAnalytics';

import MyEventsPage from "./components/MyEventsPage";

import EventForm from './components/EventForm';

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

        {/* User Route */}
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

        {/* Organizer Routes */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/analytics"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <EventAnalytics />
            </ProtectedRoute>
          }
        />

       <Route
  path="/organizer/my-events"
  element={
    <ProtectedRoute allowedRoles={['organizer']}>
      <MyEventsPage />
    </ProtectedRoute>
  }
/>

        {/* ✅ Event Creation */}
        <Route
          path="/my-events/create"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <EventForm />
            </ProtectedRoute>
          }
        />

        {/* ✅ Event Editing */}
        <Route
          path="/my-events/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <EventForm />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </>
  );
}

export default App;
