/**
 * Button Style Variants
 * Centralized button classes for consistent styling across the app
 */

export const buttonBase = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

export const buttonVariants = {
  primary: `${buttonBase} bg-primary text-primary-foreground hover:bg-primary/90`,
  secondary: `${buttonBase} bg-secondary text-secondary-foreground hover:bg-secondary/90`,
  destructive: `${buttonBase} bg-destructive text-destructive-foreground hover:bg-destructive/90`,
  outline: `${buttonBase} border border-input bg-background hover:bg-accent hover:text-accent-foreground`,
  ghost: `${buttonBase} hover:bg-accent hover:text-accent-foreground`,
  link: 'text-primary underline-offset-4 hover:underline',
  settings: `${buttonBase} bg-blue-500 text-white hover:bg-green-100 hover:text-green-700`,
};

export const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

// Additional button variants
export const linkButton = {
  default: 'text-sm underline hover:no-underline transition-colors',
  primary: 'text-primary underline hover:no-underline transition-colors',
  muted: 'text-muted-foreground underline hover:no-underline transition-colors',
};

// Toggle switch styles
export const toggleSwitch = {
  container: 'relative inline-block w-11 h-6',
  input: 'opacity-0 w-0 h-0',
  slider: 'absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300',
  sliderActive: 'bg-primary',
  sliderInactive: 'bg-muted',
  dot: 'absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-transform duration-300',
  dotActive: 'translate-x-5',
  // Complete toggle button styles (for button-based toggles)
  active: 'relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
  inactive: 'relative inline-flex h-6 w-11 items-center rounded-full bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  thumbActive: 'inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-6',
  thumbInactive: 'inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-0.5',
};
