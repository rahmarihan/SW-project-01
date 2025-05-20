import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginForm from './pages/LoginForm'
import EventList from './pages/EventList'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </Router>
  )
}

export default App;
