import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Unauthorized from './components/Unauthorized';
import Home from './components/Home';
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
import MyPage from './components/MyPage';
import AdminPage from './components/AdminPage';
import OrganizerPage from './components/OrganizerPage';
import UpdateProfile from './components/UpdateProfileForm';


//import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgetPassword';

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
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/organizerpage" element={<OrganizerPage />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          
        </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </>
  );
}

export default App;