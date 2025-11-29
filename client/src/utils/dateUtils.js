export const getDaysAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  
  // Check if date is valid
  if (isNaN(past.getTime())) return '';

  const diffTime = Math.abs(now - past);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};
