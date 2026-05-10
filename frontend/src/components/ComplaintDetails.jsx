import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, ArrowLeft, AlertCircle } from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const role = localStorage.getItem('role');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/complaints/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const updatedData = await response.json();
        setComplaint(updatedData);
        setSuccessMessage('Status updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Network error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/complaints/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch complaint details');
        }
        const data = await response.json();
        setComplaint(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading details...</div>;
  }

  if (error || !complaint) {
    return (
      <div className="loading" style={{ color: '#ef4444', flexDirection: 'column', gap: '1rem' }}>
        <AlertCircle size={48} />
        <p>Error: {error || 'Complaint not found'}</p>
        <Link to="/">
          <button className="btn" style={{ marginTop: '1rem' }}>Back to Dashboard</button>
        </Link>
      </div>
    );
  }

  const getUrgencyClass = (urgency) => {
    switch (urgency?.toUpperCase()) {
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      case 'LOW': return 'badge-low';
      default: return 'badge-low';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'badge-status-pending';
      case 'in progress': return 'badge-status-inprogress';
      case 'resolved': return 'badge-status-resolved';
      case 'rejected': return 'badge-status-rejected';
      default: return 'badge-status-pending';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="animate-fade-in">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={18} />
        <span>Back to Dashboard</span>
      </Link>
      
      <div className="glass" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{complaint.title}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className={`badge ${getUrgencyClass(complaint.urgency)}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
              {complaint.urgency || 'Unknown'} Urgency
            </span>
            {role === 'ADMIN' ? (
              <select 
                value={complaint.status} 
                onChange={handleStatusChange}
                disabled={isUpdatingStatus}
                className={`badge ${getStatusClass(complaint.status)}`}
                style={{ fontSize: '0.9rem', padding: '0.4rem 1rem', cursor: 'pointer', outline: 'none', appearance: 'auto', background: 'rgba(0,0,0,0.3)' }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            ) : (
              <span className={`badge ${getStatusClass(complaint.status)}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                {complaint.status || 'Pending'}
              </span>
            )}
          </div>
        </div>
        
        {successMessage && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="animate-fade-in">
            <AlertCircle size={18} />
            {successMessage}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span className="badge badge-category" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
            Category: {complaint.category || 'General'}
          </span>
          {complaint.reportCount > 1 && (
            <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              Reported by {complaint.reportCount} users
            </span>
          )}
          <div className="location-info" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
            <MapPin size={16} />
            <span>{complaint.location}</span>
          </div>
          <div className="location-info" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
            <Clock size={16} />
            <span>Reported on {formatDate(complaint.createdAt)}</span>
          </div>
        </div>
        
        <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.2rem' }}>Description</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {complaint.description}
          </p>
        </div>

        {complaint.imageUrl && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.2rem' }}>Attached Evidence</h3>
            <div style={{ borderRadius: 'var(--border-radius)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={`http://localhost:8080${complaint.imageUrl}`} alt="Complaint Evidence" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block', background: 'rgba(0,0,0,0.5)' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;
