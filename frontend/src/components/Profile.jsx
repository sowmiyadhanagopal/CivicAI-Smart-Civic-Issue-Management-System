import React, { useState } from 'react';
import { User, Mail, Shield, LogOut } from 'lucide-react';

function Profile() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const name = localStorage.getItem('name') || 'User';
  const email = localStorage.getItem('email') || 'Not available';
  const role = localStorage.getItem('role') || 'USER';

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '50px auto'
      }}
    >
      <div
        className="glass"
        style={{
          padding: '35px',
          borderRadius: '20px'
        }}
      >
        {/* Profile Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              margin: '0 auto 15px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(96, 165, 250, 0.15)',
              border: '2px solid rgba(96, 165, 250, 0.5)'
            }}
          >
            <User size={45} color="#60a5fa" />
          </div>

          <h1>{name}</h1>

          <p style={{ color: 'var(--text-secondary)' }}>
            My Profile
          </p>
        </div>

        {/* Name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '18px',
            marginBottom: '15px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px'
          }}
        >
          <User color="#60a5fa" />

          <div>
            <small style={{ color: 'var(--text-secondary)' }}>
              Name
            </small>

            <div>{name}</div>
          </div>
        </div>

        {/* Email */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '18px',
            marginBottom: '15px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px'
          }}
        >
          <Mail color="#60a5fa" />

          <div>
            <small style={{ color: 'var(--text-secondary)' }}>
              Email
            </small>

            <div>{email}</div>
          </div>
        </div>

        {/* Role */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '18px',
            marginBottom: '25px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px'
          }}
        >
          <Shield color="#60a5fa" />

          <div>
            <small style={{ color: 'var(--text-secondary)' }}>
              Role
            </small>

            <div>{role}</div>
          </div>
        </div>

        {/* Logout */}
        <button
          className="btn"
          onClick={() => setShowLogoutModal(true)}
          style={{
            width: '100%',
            background: '#ef4444',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Logout Confirmation */}
      {showLogoutModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <div
            className="glass"
            style={{
              width: '400px',
              maxWidth: '90%',
              padding: '30px',
              borderRadius: '16px',
              textAlign: 'center'
            }}
          >
            <LogOut
              size={45}
              color="#ef4444"
              style={{ marginBottom: '15px' }}
            />

            <h2>Confirm Logout</h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                margin: '15px 0 25px'
              }}
            >
              Are you sure you want to logout?
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px'
              }}
            >
              <button
                className="btn secondary-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn"
                onClick={confirmLogout}
                style={{
                  background: '#ef4444'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;