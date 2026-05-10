import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';

import Dashboard from './components/Dashboard';
import ComplaintForm from './components/ComplaintForm';
import ComplaintDetails from './components/ComplaintDetails';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  
  const handleLogin = () => {
    setIsAuthenticated(true);
    setRole(localStorage.getItem('role'));
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <header className="header glass">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>
            <ShieldAlert size={28} color="#60a5fa" />
            Civic AI
          </h1>
        </Link>

        <nav className="nav-links">
          <Link to="/">Dashboard</Link>

          {role === 'ADMIN' && (
            <Link to="/admin">
              <button className="btn secondary-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)' }}>
                Admin
              </button>
            </Link>
          )}
          
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button className="btn secondary-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)' }}>
                  Login
                </button>
              </Link>

              <Link to="/signup">
                <button className="btn" style={{ backgroundColor: '#10b981' }}>
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <button className="btn secondary-btn" onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#fca5a5' }}>
              Logout
            </button>
          )}

          <Link to="/report">
            <button className="btn">
              Report Issue
            </button>
          </Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ComplaintForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaint/:id"
            element={<ComplaintDetails />}
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;