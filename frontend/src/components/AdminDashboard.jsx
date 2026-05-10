import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ResponsiveContainer 
} from 'recharts';

function AdminDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [urgencyData, setUrgencyData] = useState([]);
    const [timelineData, setTimelineData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/complaints/analytics')
            .then(res => res.json())
            .then(data => {
                console.log("Fetched analytics data:", data);
                setAnalytics(data);
                
                // Set chart data directly from backend if available, otherwise empty array
                setCategoryData(data.categoryData || []);
                
                // Format urgency names (e.g. HIGH -> High)
                const formattedUrgency = (data.urgencyData || []).map(item => ({
                    name: item.name.charAt(0) + item.name.slice(1).toLowerCase(),
                    value: item.value
                }));
                setUrgencyData(formattedUrgency);
                
                setTimelineData(data.timelineData || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch analytics:", err);
                setLoading(false);
            });
    }, []);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const URGENCY_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

    if (loading) {
        return <div className="loading" style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>Loading analytics...</div>;
    }

    return (
        <div className="animate-fade-in">
            <h1 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
                Admin Dashboard
            </h1>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}
            >
                <div className="glass" style={{ padding: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Total Complaints</h2>
                    <p style={{ fontSize: '32px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{analytics?.totalComplaints || 0}</p>
                </div>

                <div className="glass" style={{ padding: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Pending</h2>
                    <p style={{ fontSize: '32px', color: '#f59e0b', fontWeight: 'bold' }}>{analytics?.pendingComplaints || 0}</p>
                </div>

                <div className="glass" style={{ padding: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Resolved</h2>
                    <p style={{ fontSize: '32px', color: '#10b981', fontWeight: 'bold' }}>{analytics?.resolvedComplaints || 0}</p>
                </div>

                <div className="glass" style={{ padding: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>High Urgency</h2>
                    <p style={{ fontSize: '32px', color: '#ef4444', fontWeight: 'bold' }}>{analytics?.highUrgencyComplaints || 0}</p>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                
                {/* Categories Pie Chart */}
                <div className="glass" style={{ padding: '20px' }}>
                    <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Complaints by Category</h3>
                    <div style={{ height: 250 }}>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                No category data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Urgency Bar Chart */}
                <div className="glass" style={{ padding: '20px' }}>
                    <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Complaints by Urgency</h3>
                    <div style={{ height: 250 }}>
                        {urgencyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={urgencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} cursor={{ fill: '#334155', opacity: 0.4 }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {urgencyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={URGENCY_COLORS[entry.name] || COLORS[0]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                No urgency data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline Line Chart */}
                <div className="glass" style={{ padding: '20px', gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Complaints Over Time</h3>
                    <div style={{ height: 300 }}>
                        {timelineData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={timelineData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e293b' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                No timeline data available
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <div className="glass" style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Recent Complaints</h2>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)' }}>
                            <th align="left" style={{ padding: '12px 8px' }}>Title</th>
                            <th align="left" style={{ padding: '12px 8px' }}>Category</th>
                            <th align="left" style={{ padding: '12px 8px' }}>Urgency</th>
                            <th align="left" style={{ padding: '12px 8px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Placeholder for table rows; in a full implementation, you'd fetch the list of complaints here */}
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>Pothole Near Main Road</td>
                            <td style={{ padding: '12px 8px' }}><span className="badge badge-category">Infrastructure</span></td>
                            <td style={{ padding: '12px 8px' }}><span className="badge badge-high">HIGH</span></td>
                            <td style={{ padding: '12px 8px' }}><span className="badge badge-status-pending">PENDING</span></td>
                        </tr>
                        <tr>
                            <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>Water Leakage</td>
                            <td style={{ padding: '12px 8px' }}><span className="badge badge-category">Water Supply</span></td>
                            <td style={{ padding: '12px 8px' }}><span className="badge badge-medium">MEDIUM</span></td>
                            <td style={{ padding: '12px 8px' }}><span className="badge badge-status-inprogress">IN PROGRESS</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;