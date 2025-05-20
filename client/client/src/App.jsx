import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import ForgotPassword from './pages/ForgotPassword';
import EventList from './pages/EventList';
import AdminDashboard from './pages/AdminDashboard';
import OrganizerPanel from './pages/OrganizerPanel';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Organizer Only */}
          <Route
            path="/organizer"
            element={
              <ProtectedRoute allowedRoles={['Event Organizer']}>
                <OrganizerPanel />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
        <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
      </Router>
    </AuthProvider>
  );
}

export default App;
