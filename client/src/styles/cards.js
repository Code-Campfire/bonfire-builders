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

// Issue card specific styles
export const issueCard = {
  container: 'min-w-[24rem] hover:border-primary/50 transition-all hover:shadow-md cursor-pointer',
  containerClosed: 'min-w-[24rem] hover:border-primary/50 transition-all hover:shadow-md cursor-pointer opacity-70',
  header: 'flex items-start justify-between gap-4',
  headerContent: 'flex-1 min-w-0',
  title: 'font-semibold text-lg mb-1 truncate',
  description: 'text-sm text-muted-foreground line-clamp-2',
  badgeColumn: 'flex flex-col gap-2 items-end shrink-0',
  metaRow: 'flex items-center gap-4 text-sm text-muted-foreground',
  metaItem: 'inline-flex items-center gap-1',
  categoryBadge: 'px-2 py-1 bg-secondary rounded-md text-secondary-foreground',
  dateInfo: 'flex items-center gap-3 text-xs',
};

// Message card styles
export const messageCard = {
  container: 'p-4 bg-muted rounded-lg border border-border',
  header: 'flex items-start justify-between mb-2',
  senderInfo: 'flex items-center gap-2',
  roleBadge: 'px-2 py-0.5 bg-secondary rounded text-xs',
  body: 'text-foreground whitespace-pre-wrap',
};

// Confirmation card styles
export const confirmationCard = {
  pending: 'mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800',
  confirmed: 'mb-6',
  disputed: 'mb-6',
};
