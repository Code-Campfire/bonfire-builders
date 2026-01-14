/**
 * Card Style Variants
 * Centralized card classes for consistent container styling
 */

export const cardBase = 'rounded-xl border bg-card text-card-foreground shadow';

export const cardVariants = {
  default: cardBase,
  elevated: `${cardBase} shadow-lg`,
  outlined: 'rounded-xl border-2 border-primary bg-card text-card-foreground',
  ghost: 'rounded-xl bg-card text-card-foreground',
};

export const cardPadding = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};
