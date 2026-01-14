/**
 * Centralized Color System
 * Uses CSS variables from index.css for consistent theming
 */

export const colors = {
  // Primary Actions
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  
  // Status Colors (for backwards compatibility)
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  
  // Backgrounds
  bgPage: 'bg-background',
  bgCard: 'bg-card',
  bgMuted: 'bg-muted',
  bgBackground: 'bg-background',
  bgSecondary: 'bg-secondary',
  bgPrimary: 'bg-primary',
  bgDestructive: 'bg-destructive',
  
  // Text
  textPrimary: 'text-foreground',
  textMuted: 'text-muted-foreground',
  textMutedForeground: 'text-muted-foreground',
  textForeground: 'text-foreground',
  textOnPrimary: 'text-primary-foreground',
  textDestructive: 'text-destructive',
  
  // Icon colors
  iconDefault: 'text-muted-foreground',
  iconPrimary: 'text-primary',
  iconSuccess: 'text-green-600',
  iconWarning: 'text-yellow-600',
  iconError: 'text-destructive',
};

// Separate icon colors export
export const iconColors = {
  default: 'text-muted-foreground',
  muted: 'h-4 w-4 text-gray-500',
  primary: 'text-primary',
  success: 'h-4 w-4 text-green-600',
  warning: 'text-yellow-600',
  error: 'text-destructive',
  acknowledged: 'text-green-600 hover:text-green-800',
};

// Navbar styles
export const navbar = {
  container: 'bg-slate-800 shadow-sm border-b border-gray-200 px-6 py-4',
  bellButton: 'relative p-2 text-white hover:bg-slate-700 rounded-lg transition-colors',
};

// Section backgrounds
export const sectionBg = {
  success: 'bg-emerald-500',
  carouselFooter: 'bg-slate-900',
};

// Alert/Notice variants
export const alerts = {
  error: 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md',
  warning: 'bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md',
  success: 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md',
  info: 'bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md',
};

// Section containers
export const sections = {
  muted: 'p-4 bg-muted rounded-lg',
  card: 'p-4 bg-card rounded-lg border border-border',
  elevated: 'p-6 bg-card rounded-lg shadow-md',
  info: 'mb-6 p-4 bg-gray-50 rounded-lg',
  alert: {
    error: 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md',
    success: 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md',
    info: 'bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md',
  },
};
