/**
 * Style Helper Functions
 * Utility functions for composing style classes
 */

import { cn } from '@/lib/utils';
import { buttonVariants, buttonSizes } from './buttons';
import { inputVariants, selectBase, textareaBase } from './forms';

/**
 * Get button classes with variant, size, and custom className
 * @param {string} variant - Button variant (primary, secondary, destructive, outline, ghost, link)
 * @param {string} size - Button size (sm, md, lg)
 * @param {string} className - Additional custom classes
 * @returns {string} Combined class string
 */
export const getButtonClasses = (variant = 'primary', size = 'md', className = '') => {
  return cn(buttonVariants[variant], buttonSizes[size], className);
};

/**
 * Get input classes with error state and custom className
 * @param {boolean} hasError - Whether the input has a validation error
 * @param {string} className - Additional custom classes
 * @returns {string} Combined class string
 */
export const getInputClasses = (hasError = false, className = '') => {
  return cn(
    inputVariants[hasError ? 'error' : 'default'],
    className
  );
};

/**
 * Get select classes with error state and custom className
 * @param {boolean} hasError - Whether the select has a validation error
 * @param {string} className - Additional custom classes
 * @returns {string} Combined class string
 */
export const getSelectClasses = (hasError = false, className = '') => {
  return cn(
    selectBase,
    hasError ? 'border-destructive' : 'border-input',
    className
  );
};

/**
 * Get textarea classes with error state
 * @param {boolean} hasError - Whether the textarea has a validation error
 * @param {string} className - Additional custom classes
 * @returns {string} Combined class string
 */
export const getTextareaClasses = (hasError = false, className = '') => {
  return cn(
    textareaBase,
    hasError ? 'border-destructive' : 'border-input',
    className
  );
};
