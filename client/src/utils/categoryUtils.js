/**
 * Format category enum value to display-friendly text
 * @param {string} category - Category enum value (e.g., "PEST_CONTROL")
 * @returns {string} - Formatted category (e.g., "Pest Control")
 */
export const formatCategory = (category) => {
  if (!category) return '';
  const categoryObj = getCategories().find(c => c.value === category);
  return categoryObj ? categoryObj.label : category;
};

/**
 * Get all available categories
 * @returns {Array} - Array of category objects with value and label
 */
export const getCategories = () => [
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'HVAC', label: 'HVAC' },
  { value: 'STRUCTURAL', label: 'Structural' },
  { value: 'APPLIANCE', label: 'Appliance' },
  { value: 'PEST_CONTROL', label: 'Pest Control' },
  { value: 'LOCKS_KEYS', label: 'Locks & Keys' },
  { value: 'FLOORING', label: 'Flooring' },
  { value: 'WALLS_CEILING', label: 'Walls & Ceiling' },
  { value: 'WINDOWS_DOORS', label: 'Windows & Doors' },
  { value: 'LANDSCAPING', label: 'Landscaping' },
  { value: 'PARKING', label: 'Parking' },
  { value: 'OTHER', label: 'Other' },
];

/**
 * Get category icon/color theme (can be expanded later)
 * @param {string} category - Category enum value
 * @returns {Object} - Object with icon name and color class
 */
export const getCategoryTheme = (category) => {
  const themes = {
    PLUMBING: { icon: 'droplet', color: 'blue' },
    ELECTRICAL: { icon: 'zap', color: 'yellow' },
    HVAC: { icon: 'wind', color: 'cyan' },
    STRUCTURAL: { icon: 'home', color: 'gray' },
    APPLIANCE: { icon: 'box', color: 'purple' },
    PEST_CONTROL: { icon: 'bug', color: 'red' },
    LOCKS_KEYS: { icon: 'key', color: 'amber' },
    FLOORING: { icon: 'square', color: 'brown' },
    WALLS_CEILING: { icon: 'maximize', color: 'slate' },
    WINDOWS_DOORS: { icon: 'door-open', color: 'teal' },
    LANDSCAPING: { icon: 'tree', color: 'green' },
    PARKING: { icon: 'car', color: 'indigo' },
    OTHER: { icon: 'help-circle', color: 'gray' },
  };
  
  return themes[category] || themes.OTHER;
};
