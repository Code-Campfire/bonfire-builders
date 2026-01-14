import { useState } from 'react';
import { 
  getButtonClasses, 
  getInputClasses, 
  getSelectClasses, 
  getTextareaClasses,
  labelBase, 
  errorText, 
  typography,
  spacing 
} from '../styles';
import { sectionBg } from '../styles/colors';

const IssueForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    location: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(formData);
    
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: '',
      location: ''
    });
  };

  return (
    <div className={sectionBg.success + ' p-6 rounded-lg shadow-md max-w-2xl mx-auto'}>
      <h2 className={`${typography.h3} mb-6`}>Report New Issue</h2>
      
      <form onSubmit={handleSubmit} className={spacing.stack}>
        {/* Title Input */}
        <div>
          <label htmlFor="title" className={labelBase}>
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={getInputClasses(!!errors.title)}
            placeholder="Brief description of the issue"
          />
          {errors.title && (
            <p className={errorText}>{errors.title}</p>
          )}
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="description" className={labelBase}>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={getTextareaClasses(!!errors.description)}
            placeholder="Provide detailed information about the issue"
          />
          {errors.description && (
            <p className={errorText}>{errors.description}</p>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className={labelBase}>
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={getSelectClasses(!!errors.category)}
          >
            <option value="">Select a category</option>
            <option value="PLUMBING">Plumbing</option>
            <option value="HVAC">HVAC</option>
            <option value="ELECTRICAL">Electrical</option>
            <option value="APPLIANCE">Appliance</option>
            <option value="STRUCTURAL">Structural</option>
            <option value="PEST_CONTROL">Pest Control</option>
            <option value="LOCKS_KEYS">Locks & Keys</option>
            <option value="FLOORING">Flooring</option>
            <option value="WALLS_CEILING">Walls & Ceiling</option>
            <option value="WINDOWS_DOORS">Windows & Doors</option>
            <option value="LANDSCAPING">Landscaping</option>
            <option value="PARKING">Parking</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.category && (
            <p className={errorText}>{errors.category}</p>
          )}
        </div>

        {/* Priority Dropdown */}
        <div>
          <label htmlFor="priority" className={labelBase}>
            Priority *
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={getSelectClasses(!!errors.priority)}
          >
            <option value="">Select priority level</option>
            <option value="LOW">Low - Can wait</option>
            <option value="MEDIUM">Medium - Should be addressed soon</option>
            <option value="HIGH">High - Needs attention</option>
            <option value="URGENT">Urgent - Immediate action required</option>
          </select>
          {errors.priority && (
            <p className={errorText}>{errors.priority}</p>
          )}
        </div>

        {/* Location Input */}
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
            className={getInputClasses(!!errors.location)}
            placeholder="e.g., Kitchen, Bedroom, Unit 4B"
          />
          {errors.location && (
            <p className={errorText}>{errors.location}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className={getButtonClasses('primary', 'md', 'flex-1')}
          >
            Submit Issue
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={getButtonClasses('secondary', 'md', 'flex-1')}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default IssueForm;