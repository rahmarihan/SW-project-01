import { Routes, Route } from 'react-router-dom'
import LoginForm from './pages/LoginForm'
import EventList from './pages/EventList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<EventList />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  )
}

export default App
