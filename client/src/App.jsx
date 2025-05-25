import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Unauthorized from './components/Unauthorized';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import AdminUsersPage from './components/AdminUsersPage';
import AdminEventsPage from './components/AdminEventsPage';
import LoginForm from './components/LoginForm';
import MyPage from './components/MyPage';
import AdminPage from './components/AdminPage';
import OrganizerPage from './components/OrganizerPage';
import UpdateProfile from './components/UpdateProfileForm';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgetPassword';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import MyEvents from './components/MyEvents';
import EventForm from './components/EventForm';
import BookingDetails from './components/BookingDetails';
import UserBookingsPage from './components/UserBookingsPage';

function App() {
  const location = useLocation();

  // Detect if we're on a specific event details page like /events/123
  const isEventDetailsPage = /^\/events\/[^/]+$/.test(location.pathname);

  // Only show navbar on certain routes, excluding /events/:id
  let showNavbar =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgetPassword' ||
    location.pathname === '/unauthorized' ||
    (location.pathname.startsWith('/events') && !isEventDetailsPage);

  const hideNavbarRoutes = ['/my-bookings', '/my-page'];

  const shouldHideNavbar = hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  // Hide navbar on /admin/events
  if (location.pathname === '/admin/events') {
    showNavbar = false;
  }

  return (
    <div className="app-layout">
      {showNavbar && !shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgetPassword" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events" element={<EventList />} />

        {/* Booking Details Route */}
        <Route path="/bookings/:id" element={<BookingDetails />} />

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

        {/* Organizer Event Routes */}
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/my-events/create" element={<EventForm />} />
        <Route path="/my-events/edit/:id" element={<EventForm />} />

        {/* Update Profile */}
        <Route path="/update-profile" element={<UpdateProfile />} />

        {/* User Bookings Route */}
        <Route path="/my-bookings" element={<UserBookingsPage />} />

        {/* Admin Events Route */}
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
          element={<AdminUsersPage />}
        />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </div>
  );
}

export default App;
