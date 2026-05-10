import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Cpu, Image as ImageIcon } from 'lucide-react';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('location', formData.location);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:8080/api/complaints', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        navigate('/');
      } else {
        alert('Failed to submit complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Network error. Make sure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container glass animate-fade-in stagger-1">
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Report an Issue</h2>
        <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Cpu size={16} color="var(--accent-color)" />
          Our AI will automatically categorize and prioritize your complaint.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="e.g., Deep pothole on Main Street"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            placeholder="e.g., 123 Main St, near the park"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Please provide details about the issue. Our AI uses this to determine urgency and category..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={16} /> Image Evidence (Optional)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
            style={{ padding: '0.5rem' }}
          />
          {imagePreview && (
            <div style={{ marginTop: '1rem', borderRadius: 'var(--border-radius)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing with AI...' : 'Submit Report'}
          {!isSubmitting && <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
