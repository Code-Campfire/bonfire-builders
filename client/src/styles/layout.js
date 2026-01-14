/**
 * Layout Utilities
 * Centralized layout patterns for consistent spacing and structure
 */

export const layout = {
  pageContainer: 'min-h-screen bg-background p-6',
  contentContainer: 'max-w-5xl mx-auto',
  contentContainerLg: 'max-w-3xl mx-auto',
  sectionContainer: 'space-y-6',
  
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',
  flexGap2: 'flex items-center gap-2',
  flexGap3: 'flex gap-3',
  
  gridCols2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  gridCols3: 'grid grid-cols-1 md:grid-cols-3 gap-4',
};

// Flex row utilities
export const flexRow = {
  base: 'flex flex-row',
  centerCenter: 'flex items-center justify-center',
  spaceBetween: 'flex items-center justify-between',
  startCenter: 'flex items-center',
  startStart: 'flex items-start',
  endCenter: 'flex items-center justify-end',
};

// Flex column utilities
export const flexCol = {
  base: 'flex flex-col',
  centerCenter: 'flex flex-col items-center justify-center',
  spaceBetween: 'flex flex-col justify-between',
  startCenter: 'flex flex-col items-center',
  startStart: 'flex flex-col items-start',
};

// Timeline styles
export const timeline = {
  item: 'flex gap-4',
  dotContainer: 'flex flex-col items-center',
  content: 'flex-1 pb-4',
  dot: {
    blue: 'w-3 h-3 bg-blue-500 rounded-full',
    green: 'w-3 h-3 bg-green-500 rounded-full',
    gray: 'w-3 h-3 bg-gray-500 rounded-full',
  },
  line: 'w-0.5 h-full bg-gray-200 mt-1',
};

// Spacing utilities
export const spacing = {
  p6: 'p-6',
  section: 'mb-6',
  sectionLg: 'mb-8',
  stack: 'space-y-4',
  stackSm: 'space-y-2',
  stackLg: 'space-y-6',
  gap1: 'gap-1',
  gap2: 'gap-2',
  gap3: 'gap-3',
  gap4: 'gap-4',
};
