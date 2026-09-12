import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useState } from 'react';

import Dashboard from './components/Dashboard';
import ComplaintForm from './components/ComplaintForm';
import ComplaintDetails from './components/ComplaintDetails';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = () => {
    setIsAuthenticated(true);
    setRole(localStorage.getItem('role'));
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

          {/* Dashboard */}
          <Link to="/">
            Dashboard
          </Link>

          {/* Admin - visible only for ADMIN */}
          {role === 'ADMIN' && (
            <Link to="/admin">
              <button
                className="btn secondary-btn"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text-primary)'
                }}
              >
                Admin
              </button>
            </Link>
          )}

          {/* Login / Signup / Profile */}
          {!isAuthenticated ? (
            <>
              {/* Login */}
              <Link to="/login">
                <button
                  className="btn secondary-btn"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Login
                </button>
              </Link>

              {/* Signup */}
              <Link to="/signup">
                <button
                  className="btn"
                  style={{
                    backgroundColor: '#10b981'
                  }}
                >
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            /* Profile */
            <Link to="/profile">
              <button
                className="btn secondary-btn"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(96, 165, 250, 0.5)',
                  color: '#93c5fd'
                }}
              >
                Profile
              </button>
            </Link>
          )}

          {/* Report Issue */}
          <Link to="/report">
            <button className="btn">
              Report Issue
            </button>
          </Link>

        </nav>
      </header>

      <main className="container">
        <Routes>

          {/* Dashboard */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              <Login onLogin={handleLogin} />
            }
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Report Issue */}
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ComplaintForm />
              </ProtectedRoute>
            }
          />

          {/* Complaint Details */}
          <Route
            path="/complaint/:id"
            element={<ComplaintDetails />}
          />

          {/* Admin Dashboard */}
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