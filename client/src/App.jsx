import { Routes, Route, useLocation } from 'react-router-dom';
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
import UpdateProfile from './components/UpdateProfileForm';

import ProfilePage from './pages/ProfilePage';
import MyPage from './components/MyPage';
import AdminPage from './components/AdminPage';
import OrganizerPage from './components/OrganizerPage';

import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import MyEvents from './components/MyEvents';
import MyEventsPage from './components/MyEventsPage';
import EventForm from './components/EventForm';
import EventAnalytics from './components/EventAnalytics';

import BookingDetails from './components/BookingDetails';
import UserBookingsPage from './components/UserBookingsPage';

import AdminUsersPage from './components/AdminUsersPage';
import AdminEventsPage from './components/AdminEventsPage';

function App() {
  const location = useLocation();

  // Detect if we're on a specific event details page like /events/123
  const isEventDetailsPage = /^\/events\/[^/]+$/.test(location.pathname);

  // Define where the navbar should be shown
  let showNavbar =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgetPassword' ||
    location.pathname === '/unauthorized' ||
    (location.pathname.startsWith('/events') && !isEventDetailsPage);

  const hideNavbarRoutes = ['/my-bookings', '/my-page'];
  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  // Hide navbar on /admin/events
  if (location.pathname === '/admin/events') {
    showNavbar = false;
  }

  return (
    <div className="app-layout">
      {showNavbar && !shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgetPassword" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />

        {/* User Protected Routes */}
        <Route
          path="/my-page"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        {/* Organizer Protected Routes */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerPage />
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
        <Route
          path="/organizer/analytics"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <EventAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events/create"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <MyEvents />
            </ProtectedRoute>
          }
        />

        {/* Shared Protected */}
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'organizer']}>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </div>
  );
}

export default App;
