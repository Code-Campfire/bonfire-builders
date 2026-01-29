import prisma from '../lib/prisma';

interface TimeMetrics {
  avgResponseTime: number | null; // createdAt → acknowledged_date
  avgQueueTime: number | null; // acknowledged_date → in_progress_date
  avgWorkTime: number | null; // in_progress_date → resolved_date
  avgTotalResolution: number | null; // createdAt → resolved_date
  confirmationRate: number | null; // % of resolved issues confirmed by tenant
}

interface CategoryMetrics {
  category: string;
  avgResolutionTime: number | null; // in days
  issueCount: number;
}

interface LandlordMetrics {
  overall: TimeMetrics;
  byCategory: CategoryMetrics[];
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  closedIssues: number;
}

interface TenantMetrics {
  avgResolutionTime: number | null; // 30-day rolling average
  avgResponseTime: number | null; // 30-day rolling average
  confirmationRate: number | null;
  byCategory: CategoryMetrics[];
}

/**
 * Calculate average time difference in hours between two dates
 * Returns null if no valid data points
 */
function calculateAvgTimeDiff(
  issues: any[],
  startDateField: string,
  endDateField: string
): number | null {
  const validIssues = issues.filter(
    (issue) => issue[startDateField] && issue[endDateField]
  );

  if (validIssues.length === 0) return null;

  const totalHours = validIssues.reduce((sum, issue) => {
    const start = new Date(issue[startDateField]);
    const end = new Date(issue[endDateField]);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + diffHours;
  }, 0);

  return totalHours / validIssues.length;
}

/**
 * Calculate confirmation rate
 */
function calculateConfirmationRate(issues: any[]): number | null {
  const resolvedIssues = issues.filter(
    (issue) => issue.status === 'RESOLVED' || issue.status === 'CLOSED'
  );

  if (resolvedIssues.length === 0) return null;

  const confirmedIssues = resolvedIssues.filter(
    (issue) => issue.tenant_confirmed === true
  );

  return (confirmedIssues.length / resolvedIssues.length) * 100;
}

/**
 * Get metrics for landlords (all issues in their complex)
 */
export async function getLandlordMetrics(
  complexId: number,
  daysBack: number = 0
): Promise<LandlordMetrics> {
  // Build where clause with optional date filter
  const whereClause: any = { complex_id: complexId };

  if (daysBack > 0) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    whereClause.createdAt = { gte: startDate };
  }

  const issues = await prisma.issue.findMany({
    where: whereClause,
    select: {
      id: true,
      category: true,
      status: true,
      createdAt: true,
      acknowledged_date: true,
      in_progress_date: true,
      resolved_date: true,
      closed_date: true,
      tenant_confirmed: true
    }
  });

  // Overall time metrics
  const overall: TimeMetrics = {
    avgResponseTime: calculateAvgTimeDiff(issues, 'createdAt', 'acknowledged_date'),
    avgQueueTime: calculateAvgTimeDiff(issues, 'acknowledged_date', 'in_progress_date'),
    avgWorkTime: calculateAvgTimeDiff(issues, 'in_progress_date', 'resolved_date'),
    avgTotalResolution: calculateAvgTimeDiff(issues, 'createdAt', 'resolved_date'),
    confirmationRate: calculateConfirmationRate(issues)
  };

  // Metrics by category
  const categories = [
    'PLUMBING',
    'ELECTRICAL',
    'HVAC',
    'STRUCTURAL',
    'APPLIANCE',
    'PEST_CONTROL',
    'LOCKS_KEYS',
    'FLOORING',
    'WALLS_CEILING',
    'WINDOWS_DOORS',
    'LANDSCAPING',
    'PARKING',
    'OTHER'
  ];

  const byCategory: CategoryMetrics[] = categories.map((category) => {
    const categoryIssues = issues.filter((issue) => issue.category === category);
    const resolvedCategoryIssues = categoryIssues.filter((issue) => issue.resolved_date);
    const avgResolutionTime = calculateAvgTimeDiff(
      categoryIssues,
      'createdAt',
      'resolved_date'
    );

    return {
      category,
      avgResolutionTime: avgResolutionTime ? avgResolutionTime / 24 : null, // Convert to days
      issueCount: resolvedCategoryIssues.length // Only count resolved issues
    };
  }).filter((cat) => cat.issueCount > 0 && cat.avgResolutionTime !== null); // Only include categories with resolved issues

  // Status counts
  const totalIssues = issues.length;
  const openIssues = issues.filter((i) => i.status === 'OPEN').length;
  const inProgressIssues = issues.filter((i) => i.status === 'IN_PROGRESS').length;
  const resolvedIssues = issues.filter((i) => i.status === 'RESOLVED').length;
  const closedIssues = issues.filter((i) => i.status === 'CLOSED').length;

  return {
    overall,
    byCategory,
    totalIssues,
    openIssues,
    inProgressIssues,
    resolvedIssues,
    closedIssues
  };
}

/**
 * Get metrics for tenants (30-day rolling average by default)
 */
export async function getTenantMetrics(
  complexId: number,
  daysBack: number = 30
): Promise<TenantMetrics> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const issues = await prisma.issue.findMany({
    where: {
      complex_id: complexId,
      createdAt: { gte: startDate }
    },
    select: {
      id: true,
      category: true,
      status: true,
      createdAt: true,
      acknowledged_date: true,
      resolved_date: true,
      tenant_confirmed: true
    }
  });

  // Calculate average resolution time (createdAt → resolved_date)
  const avgResolutionTime = calculateAvgTimeDiff(issues, 'createdAt', 'resolved_date');

  // Calculate average response time (createdAt → acknowledged_date)
  const avgResponseTime = calculateAvgTimeDiff(issues, 'createdAt', 'acknowledged_date');

  // Calculate confirmation rate
  const confirmationRate = calculateConfirmationRate(issues);

  // Metrics by category (30-day rolling)
  const categories = [
    'PLUMBING',
    'ELECTRICAL',
    'HVAC',
    'STRUCTURAL',
    'APPLIANCE',
    'PEST_CONTROL',
    'LOCKS_KEYS',
    'FLOORING',
    'WALLS_CEILING',
    'WINDOWS_DOORS',
    'LANDSCAPING',
    'PARKING',
    'OTHER'
  ];

  const byCategory: CategoryMetrics[] = categories.map((category) => {
    const categoryIssues = issues.filter((issue) => issue.category === category);
    const resolvedCategoryIssues = categoryIssues.filter((issue) => issue.resolved_date);
    const avgResTime = calculateAvgTimeDiff(
      categoryIssues,
      'createdAt',
      'resolved_date'
    );

    return {
      category,
      avgResolutionTime: avgResTime ? avgResTime / 24 : null, // Convert to days
      issueCount: resolvedCategoryIssues.length // Only count resolved issues
    };
  }).filter((cat) => cat.issueCount > 0 && cat.avgResolutionTime !== null); // Only include categories with resolved issues

  return {
    avgResolutionTime: avgResolutionTime ? avgResolutionTime / 24 : null, // Convert to days
    avgResponseTime: avgResponseTime ? avgResponseTime / 24 : null, // Convert to days
    confirmationRate,
    byCategory
  };
}
