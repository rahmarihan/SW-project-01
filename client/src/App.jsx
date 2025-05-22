import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

//import EventList from './pages/EventList';
//import AdminDashboard from './pages/AdminDashboard';
//import OrganizerPanel from './pages/OrganizerPanel';
import ProfilePage from './pages/ProfilePage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminEventsPage from './pages/AdminEventsPage'; // ✅ NEW

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgetPassword';
// import EventList from './pages/EventList';
// import AdminDashboard from './pages/AdminDashboard';
// import OrganizerPanel from './pages/OrganizerPanel';



function App() {
  return (
      <>
        <Navbar />

        <Routes>
          {/* <Route path="/" element={<EventList />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgetPassword" element={<ForgotPassword />} />

          {/* Profile (All Roles) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['User', 'Admin', 'Event Organizer']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Only */}
          {/* Admin Only
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminEventsPage />
              </ProtectedRoute>
            }
          />
          /> */}

          {/* Organizer Only
          <Route
            path="/organizer"
            element={
              <ProtectedRoute allowedRoles={['Event Organizer']}>
                <OrganizerPanel />
              </ProtectedRoute>
            }
          /> */}
        </Routes>

        <Footer />
        <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
      </>
  );
}

export default App;
