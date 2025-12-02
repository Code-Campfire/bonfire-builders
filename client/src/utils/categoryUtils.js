/**
 * Formats category enum values for display
 * Converts SNAKE_CASE to Title Case
 */
export const formatCategory = (category) => {
  if (!category) return '';
  
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Gets all available categories
 */
export const getAllCategories = () => [
  'PLUMBING',
  'ELECTRICAL',
  'HVAC',
  'STRUCTURAL',
  'APPLIANCE',
  'PEST_CONTROL',
  'LOCKS_KEYS',
  'FLOORING',
  'WALLS_CEILING',
  'WINDOWS_DOORS',
  'LANDSCAPING',
  'PARKING',
  'OTHER'
];

/**
 * Gets category icon based on type
 */
export const getCategoryIcon = (category) => {
  const icons = {
    PLUMBING: '🔧',
    ELECTRICAL: '⚡',
    HVAC: '❄️',
    STRUCTURAL: '🏗️',
    APPLIANCE: '🔌',
    PEST_CONTROL: '🐛',
    LOCKS_KEYS: '🔑',
    FLOORING: '📐',
    WALLS_CEILING: '🎨',
    WINDOWS_DOORS: '🚪',
    LANDSCAPING: '🌳',
    PARKING: '🚗',
    OTHER: '📋'
  };
  
  return icons[category] || '📋';
};

/**
 * Gets category color for badges
 */
export const getCategoryColor = (category) => {
  const colors = {
    PLUMBING: 'bg-blue-100 text-blue-800',
    ELECTRICAL: 'bg-yellow-100 text-yellow-800',
    HVAC: 'bg-cyan-100 text-cyan-800',
    STRUCTURAL: 'bg-orange-100 text-orange-800',
    APPLIANCE: 'bg-purple-100 text-purple-800',
    PEST_CONTROL: 'bg-red-100 text-red-800',
    LOCKS_KEYS: 'bg-gray-100 text-gray-800',
    FLOORING: 'bg-amber-100 text-amber-800',
    WALLS_CEILING: 'bg-pink-100 text-pink-800',
    WINDOWS_DOORS: 'bg-teal-100 text-teal-800',
    LANDSCAPING: 'bg-green-100 text-green-800',
    PARKING: 'bg-slate-100 text-slate-800',
    OTHER: 'bg-neutral-100 text-neutral-800'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800';
};