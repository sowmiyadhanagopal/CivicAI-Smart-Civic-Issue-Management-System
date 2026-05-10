import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';

const ComplaintCard = ({ complaint, delay }) => {
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
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link to={`/complaint/${complaint.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={`card glass animate-fade-in`} style={{ animationDelay: `${delay}s`, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {complaint.imageUrl && (
          <div style={{ margin: '-1.5rem -1.5rem 1.5rem -1.5rem', height: '180px', overflow: 'hidden', borderTopLeftRadius: 'var(--border-radius)', borderTopRightRadius: 'var(--border-radius)' }}>
            <img src={`http://localhost:8080${complaint.imageUrl}`} alt="Complaint Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div className="card-header">
          <h3 className="card-title">{complaint.title}</h3>
          <span className={`badge ${getUrgencyClass(complaint.urgency)}`}>
            {complaint.urgency || 'Unknown'}
          </span>
        </div>
        
        {complaint.reportCount > 1 && (
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              Reported by {complaint.reportCount} users
            </span>
          </div>
        )}
        
        <div className="card-meta">
          <span className="badge badge-category">{complaint.category || 'General'}</span>
          <span className={`badge ${getStatusClass(complaint.status)}`}>{complaint.status || 'Pending'}</span>
        </div>
        
        <div className="card-body" style={{ flex: 1 }}>
          <p>{complaint.description}</p>
        </div>
        
        <div className="card-footer">
          <div className="location-info">
            <MapPin size={14} />
            <span>{complaint.location}</span>
          </div>
          <div className="location-info">
            <Clock size={14} />
            <span>{formatDate(complaint.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ComplaintCard;
