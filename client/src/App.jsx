import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

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

          {/* Admin Only
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
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
