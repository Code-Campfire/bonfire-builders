import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { issueAPI } from '../services/api';
import { formatCategory } from '../utils/categoryUtils';
import { getButtonClasses, getInputClasses, getSelectClasses, getTextareaClasses } from '../styles/helpers';
import { colors } from '../styles/colors';
import { labelBase } from '../styles/forms';
import { typography } from '../styles/typography';
import { spacing, flexRow, flexCol } from '../styles/layout';

const CATEGORIES = [
  'PLUMBING', 'ELECTRICAL', 'HVAC', 'STRUCTURAL', 'APPLIANCE',
  'PEST_CONTROL', 'LOCKS_KEYS', 'FLOORING', 'WALLS_CEILING',
  'WINDOWS_DOORS', 'LANDSCAPING', 'PARKING', 'OTHER'
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function EditIssue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    location: ''
  });

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const data = await issueAPI.getIssueById(id);
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        location: data.location
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching issue:', err);
      setError('Failed to load issue');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.priority || !formData.location) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await issueAPI.updateIssue(id, formData);
      navigate(`/issues/${id}`);
    } catch (err) {
      console.error('Error updating issue:', err);
      alert('Failed to update issue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={colors.bgBackground + ' min-h-screen ' + flexCol.centerCenter}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={colors.bgBackground + ' min-h-screen ' + flexCol.centerCenter}>
        <div className="text-center">
          <p className={colors.textDestructive + ' mb-4'}>{error}</p>
          <button
            onClick={() => navigate('/issues')}
            className={getButtonClasses('link')}
          >
            Back to Issues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={colors.bgBackground + ' min-h-screen ' + spacing.p6}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/issues/${id}`)}
            className={getButtonClasses('link') + ' mb-4'}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Maintenance Request</span>
          </button>
          <h1 className={typography.h1 + ' text-center'}>Edit Issue</h1>
        </div>

        {/* Form */}
        <div className={colors.bgCard + ' rounded-lg shadow-md ' + spacing.p6}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className={labelBase}>
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={getInputClasses()}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelBase}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={getTextareaClasses()}
                placeholder="Detailed description of the issue"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className={labelBase}>
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={getSelectClasses()}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {formatCategory(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className={labelBase}>
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={getSelectClasses()}
                required
              >
                <option value="">Select priority</option>
                {PRIORITIES.map(priority => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className={labelBase}>
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={getInputClasses()}
                placeholder="e.g., Kitchen, Bathroom, Living Room"
                required
              />
            </div>

            {/* Submit Button */}
            <div className={flexRow.startCenter + ' ' + spacing.gap3 + ' pt-4'}>
              <button
                type="submit"
                disabled={submitting}
                className={'flex-1 ' + getButtonClasses('primary')}
              >
                {submitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/issues/${id}`)}
                className={getButtonClasses('outline')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}