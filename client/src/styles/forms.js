/**
 * Form Element Styles
 * Centralized form input, label, and error styling
 */

export const inputBase = 'w-full px-3 py-2 border rounded-md bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50';

export const inputVariants = {
  default: `${inputBase} border-input`,
  error: `${inputBase} border-destructive`,
  success: `${inputBase} border-green-500`,
};

export const labelBase = 'block text-sm font-medium text-foreground mb-1';

export const errorText = 'text-destructive text-sm mt-1';

export const textareaBase = 'w-full px-3 py-2 border rounded-md bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none';

export const selectBase = 'w-full px-3 py-2 border rounded-md bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

export const selectVariants = {
  default: `${selectBase} border-input`,
  error: `${selectBase} border-destructive`,
};
