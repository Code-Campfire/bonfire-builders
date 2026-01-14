/**
 * Typography System
 * Centralized text styles for consistent typography
 */

export const typography = {
  h1: 'text-4xl font-bold text-foreground',
  h2: 'text-3xl font-bold text-foreground',
  h3: 'text-2xl font-semibold text-foreground',
  h4: 'text-xl font-semibold text-foreground',
  h5: 'text-lg font-semibold text-foreground',
  
  body: 'text-base text-foreground',
  bodyMuted: 'text-base text-muted-foreground',
  small: 'text-sm text-foreground',
  smallMuted: 'text-sm text-muted-foreground',
  xsmall: 'text-xs text-muted-foreground',
  
  label: 'text-sm font-medium text-foreground',
  caption: 'text-xs text-muted-foreground',
};

// Additional text styles
export const textColors = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  error: 'text-destructive',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

// Text with hover states
export const textHover = {
  default: 'text-foreground hover:text-primary',
  muted: 'text-muted-foreground hover:text-foreground',
  primary: 'text-primary hover:text-primary/80',
};
