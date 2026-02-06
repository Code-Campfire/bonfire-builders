import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cardVariants, cardPadding } from '../../styles';

/**
 * MetricsCard - Display a single metric with title, value, and optional description
 *
 * @param {string} title - The metric title
 * @param {number|null} value - The metric value (can be null if no data)
 * @param {string} unit - The unit to display (e.g., "hours", "days", "%")
 * @param {string} description - Optional description text
 * @param {string} variant - Card variant ('default', 'elevated')
 * @param {string} linkTo - Optional URL to navigate to when clicked
 */
const MetricsCard = ({ title, value, unit, description, variant = 'default', linkTo }) => {
  const navigate = useNavigate();
  const formatValue = (val, unitType) => {
    if (val === null || val === undefined) {
      return 'No data';
    }

    if (unitType === '%') {
      const rounded = Math.round(val * 10) / 10;
      return `${rounded}%`;
    } else if (unitType === 'days') {
      // Show in days, hours, or minutes depending on magnitude
      if (val < 1) {
        const hours = Math.round(val * 24 * 10) / 10;
        if (hours < 1) {
          const minutes = Math.round(hours * 60);
          return `${minutes} min`;
        }
        return `${hours} hrs`;
      }

      // For >= 1 day, show "X days Y hours"
      const days = Math.floor(val);
      const remainingHours = Math.round((val - days) * 24);

      if (remainingHours === 0) {
        return `${days} ${days === 1 ? 'day' : 'days'}`;
      }
      return `${days} ${days === 1 ? 'day' : 'days'} ${remainingHours} ${remainingHours === 1 ? 'hr' : 'hrs'}`;
    } else if (unitType === 'hours') {
      // For hours unit
      if (val < 1) {
        const minutes = Math.round(val * 60);
        return `${minutes} min`;
      }

      // For >= 24 hours, show "X days Y hours"
      if (val >= 24) {
        const days = Math.floor(val / 24);
        const remainingHours = Math.round(val % 24);

        if (remainingHours === 0) {
          return `${days} ${days === 1 ? 'day' : 'days'}`;
        }
        return `${days} ${days === 1 ? 'day' : 'days'} ${remainingHours} ${remainingHours === 1 ? 'hr' : 'hrs'}`;
      }

      // For < 24 hours, show "X hrs"
      const rounded = Math.round(val * 10) / 10;
      return `${rounded} ${rounded === 1 ? 'hr' : 'hrs'}`;
    }

    // For counts or other units
    return `${val} ${unitType}`;
  };

  const handleClick = () => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  return (
    <Card
      className={`${cardVariants[variant]}${linkTo ? ' cursor-pointer hover:bg-accent/50 transition-colors' : ''}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(value, unit)}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
