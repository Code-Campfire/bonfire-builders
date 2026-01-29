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

// Status badge colors (exact colors from StatusBadge.jsx)
export const statusColors = {
  OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  RESOLVED: 'bg-green-100 text-green-800 border-green-200',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

// Priority badge colors (exact colors from PriorityBadge.jsx)
export const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800 border-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-800 border-blue-300',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
  URGENT: 'bg-red-100 text-red-800 border-red-300',
  default: 'bg-gray-100 text-gray-800 border-gray-300',
};

// Confirmation/status icon colors
export const confirmationColors = {
  confirmed: 'text-green-500',
  disputed: 'text-red-500',
  pending: 'text-amber-500',
};

// Confirmation button overrides
export const confirmationButtons = {
  confirm: 'bg-green-600 hover:bg-green-500',
  dispute: 'bg-red-600 text-white hover:bg-red-500',
};

// Confirmation card styling
export const confirmationCard = {
  pending: 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800',
};

// Carousel/modal overlay styles
export const overlay = {
  backdrop: 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4',
  container: 'relative w-full max-w-4xl max-h-[90vh] bg-black bg-opacity-90 overflow-hidden rounded-lg flex flex-col',
  closeButton: 'absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-colors',
  captionOverlay: 'absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 rounded-b-lg',
  timestampOverlay: 'absolute top-2 right-2 bg-black bg-opacity-60 px-3 py-1 rounded-md',
};

// Loading spinner
export const loadingStyles = {
  spinner: 'animate-spin h-12 w-12 text-primary mb-4',
  spinnerSmall: 'animate-spin h-6 w-6 text-muted-foreground',
  spinnerBorder: 'animate-spin rounded-full h-12 w-12 border-b-2 border-primary',
};

// Notification dropdown styles
export const notificationStyles = {
  container: 'relative',
  dropdown: 'absolute right-0 mt-2 w-96 rounded-lg shadow-lg border border-border z-50',
  listContainer: 'max-h-96 overflow-y-auto',
  item: 'px-4 py-3 hover:bg-muted cursor-pointer border-b border-border transition-colors',
  itemContent: 'flex-1',
};
