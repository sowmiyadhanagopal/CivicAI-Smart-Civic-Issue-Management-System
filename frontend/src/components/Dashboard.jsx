import { useState, useEffect } from 'react';
import ComplaintCard from './ComplaintCard';
import Analytics from './Analytics';
import { AlertCircle, Search, Filter } from 'lucide-react';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Sorting State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (debouncedSearch) queryParams.append('search', debouncedSearch);
        if (category) queryParams.append('category', category);
        if (urgency) queryParams.append('urgency', urgency);
        if (status) queryParams.append('status', status);
        if (sort) queryParams.append('sort', sort);

        const response = await fetch(`http://localhost:8080/api/complaints?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [debouncedSearch, category, urgency, status, sort]);

  if (loading) {
    return <div className="loading">Loading complaints...</div>;
  }

  if (error) {
    return (
      <div className="loading" style={{ color: '#ef4444', flexDirection: 'column', gap: '1rem' }}>
        <AlertCircle size={48} />
        <p>Error: {error}</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Make sure the backend is running on port 8080.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <h2>Recent Civic Issues</h2>
        <span className="badge badge-category" style={{ padding: '0.5rem 1rem' }}>
          Total: {complaints.length}
        </span>
      </div>
      
      {/* Controls Toolbar */}
      <div className="glass animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search by title, description, or location..." 
            style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '1rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Category</label>
            <select className="form-control" value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '0.5rem' }}>
              <option value="">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Noise">Noise</option>
              <option value="General">General</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Urgency</label>
            <select className="form-control" value={urgency} onChange={e => setUrgency(e.target.value)} style={{ padding: '0.5rem' }}>
              <option value="">All Urgencies</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Status</label>
            <select className="form-control" value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '0.5rem' }}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Sort By</label>
            <select className="form-control" value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '0.5rem' }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_urgency">Highest Urgency First</option>
            </select>
          </div>
        </div>
      </div>

      {complaints.length > 0 && <Analytics complaints={complaints} />}

      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '600' }}>Recent Complaints</h2>

      {complaints.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>No complaints reported yet. Be the first to report an issue in your area.</p>
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map((complaint, index) => (
            <ComplaintCard 
              key={complaint.id} 
              complaint={complaint} 
              delay={0.1 * (index % 10)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
