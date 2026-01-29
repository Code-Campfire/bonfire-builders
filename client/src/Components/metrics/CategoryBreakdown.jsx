import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cardVariants } from '../../styles';
import { formatCategory } from '@/utils/categoryUtils';

/**
 * CategoryBreakdown - Display resolution time metrics by category
 *
 * @param {Array} data - Array of category metrics: [{ category, avgResolutionTime, issueCount }]
 * @param {string} title - Card title
 */
const CategoryBreakdown = ({ data, title = 'Resolution Time by Category' }) => {
  // Sort by longest resolution time first and filter out null values (unresolved issues)
  const sortedData = (data || [])
    .filter(item => item.avgResolutionTime !== null)
    .sort((a, b) => (b.avgResolutionTime || 0) - (a.avgResolutionTime || 0));

  if (sortedData.length === 0) {
    return (
      <Card className={cardVariants.default}>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No data available yet. Metrics will appear once issues are resolved.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Find max value for scaling the bars
  const maxTime = Math.max(...sortedData.map(item => item.avgResolutionTime || 0));

  const formatTime = (days) => {
    if (days === null || days === undefined) return 'N/A';

    if (days < 1) {
      const hours = Math.round(days * 24 * 10) / 10;
      if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes}m`;
      }
      return `${hours}h`;
    }

    const rounded = Math.round(days * 10) / 10;
    return `${rounded}d`;
  };

  return (
    <Card className={cardVariants.default}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Average time from submission to resolution
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((item, index) => {
            const widthPercentage = maxTime > 0
              ? ((item.avgResolutionTime || 0) / maxTime) * 100
              : 0;

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {formatCategory(item.category)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({item.issueCount} {item.issueCount === 1 ? 'issue' : 'issues'})
                    </span>
                  </div>
                  <span className="font-semibold">
                    {formatTime(item.avgResolutionTime)}
                  </span>
                </div>
                <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;
