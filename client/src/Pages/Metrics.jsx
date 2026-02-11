import { useState, useEffect } from "react";
import { cardVariants, cardPadding, typography, buttonSizes } from "../styles";
import MetricsCard from "../Components/metrics/MetricsCard";
import CategoryBreakdown from "../Components/metrics/CategoryBreakdown";
import { metricsAPI } from "../services/api";
import { useAuth } from "../context/context";

function Metrics() {
  const { user } = useAuth();
  const [metricsData, setMetricsData] = useState({
    all: null,
    30: null,
    90: null,
  });
  const [selectedRange, setSelectedRange] = useState("all"); // 'all', '30', '90'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLandlord = user?.role === "LANDLORD" || user?.role === "ADMIN";

  useEffect(() => {
    const fetchAllMetrics = async () => {
      try {
        setLoading(true);

        // Fetch all three ranges in parallel
        const requests = isLandlord
          ? [
              metricsAPI.getMetrics(null), // All time
              metricsAPI.getMetrics(30), // 30 days
              metricsAPI.getMetrics(90), // 90 days
            ]
          : [
              metricsAPI.getMetrics(30), // 30 days (tenants don't see all time)
              metricsAPI.getMetrics(90), // 90 days
            ];

        const results = await Promise.all(requests);

        if (isLandlord) {
          setMetricsData({
            all: results[0],
            30: results[1],
            90: results[2],
          });
        } else {
          setMetricsData({
            all: null,
            30: results[0],
            90: results[1],
          });
          setSelectedRange("30"); // Default to 30 days for tenants
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
        setError("Failed to load metrics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAllMetrics();
    }
  }, [user, isLandlord]);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  // Get the currently selected metrics
  const metrics = metricsData[selectedRange]?.metrics;
  const daysBack = metricsData[selectedRange]?.daysBack;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className={`${cardVariants.default} ${cardPadding.lg}`}>
            <p className="text-muted-foreground">Loading metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className={`${cardVariants.default} ${cardPadding.lg}`}>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // No metrics data
  if (!metrics) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className={`${cardVariants.default} ${cardPadding.lg}`}>
            <p className="text-muted-foreground">No metrics available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`${typography.h1} mb-2`}>Resolution Metrics</h1>
            <p className="text-foreground">
              {isLandlord
                ? "Track your performance and identify areas for improvement"
                : `View average resolution times for your complex`}
            </p>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground mr-2">Time Range:</span>
            <div className="inline-flex rounded-lg border border-border bg-card p-1">
              {isLandlord && (
                <button
                  onClick={() => handleRangeChange("all")}
                  className={`${buttonSizes.sm} font-medium rounded-md transition-colors ${
                    selectedRange === "all"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Time
                </button>
              )}
              <button
                onClick={() => handleRangeChange("30")}
                className={`${buttonSizes.sm} font-medium rounded-md transition-colors ${
                  selectedRange === "30"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => handleRangeChange("90")}
                className={`${buttonSizes.sm} font-medium rounded-md transition-colors ${
                  selectedRange === "90"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                90 Days
              </button>
            </div>
          </div>
        </div>

        {/* Landlord View */}
        {isLandlord && metrics && (
          <>
            {/* Key Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricsCard
                title="Total Resolution"
                value={metrics.overall.avgTotalResolution}
                unit="hours"
                description="End-to-end resolution time"
              />
              <MetricsCard
                title="Response Time"
                value={metrics.overall.avgResponseTime}
                unit="hours"
                description="Time to acknowledge issues"
              />
              <MetricsCard
                title="Queue Time"
                value={metrics.overall.avgQueueTime}
                unit="hours"
                description="Time before work starts (acknowledged to in progress)"
              />
              <MetricsCard
                title="Work Time"
                value={metrics.overall.avgWorkTime}
                unit="hours"
                description="Active work duration (in progress to resolved)"
              />
            </div>

            {/* Second Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <MetricsCard
                title="Tenant Satisfaction"
                value={metrics.overall.confirmationRate}
                unit="%"
                description="Percentage of tenants confirming resolution"
              />
              <MetricsCard
                title="Active Issues"
                value={
                  metrics.openIssues +
                  metrics.inProgressIssues +
                  metrics.resolvedIssues
                }
                unit=""
                description="Not yet closed"
                linkTo="/issues"
              />
              <MetricsCard
                title="Open"
                value={metrics.openIssues}
                unit=""
                description="Awaiting attention"
                linkTo="/issues?status=OPEN"
              />
              <MetricsCard
                title="In Progress"
                value={metrics.inProgressIssues}
                unit=""
                description="Being worked on"
                linkTo="/issues?status=IN_PROGRESS"
              />
              <MetricsCard
                title="Resolved"
                value={metrics.resolvedIssues}
                unit=""
                description="Awaiting confirmation"
                linkTo="/issues?status=RESOLVED"
              />
            </div>

            {/* Category Breakdown */}
            <CategoryBreakdown
              data={metrics.byCategory}
              title="Resolution Time by Category"
            />
          </>
        )}

        {/* Tenant View */}
        {!isLandlord && metrics && (
          <>
            {/* Key Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-3">
              <MetricsCard
                title="Avg Resolution Time"
                value={metrics.avgResolutionTime}
                unit="days"
                description={`Last ${daysBack || 30} days`}
              />
              <MetricsCard
                title="Avg Response Time"
                value={metrics.avgResponseTime}
                unit="days"
                description="Time to first acknowledgment"
              />
              <MetricsCard
                title="Tenant Satisfaction"
                value={metrics.confirmationRate}
                unit="%"
                description="Percentage of tenants confirming resolution"
              />
            </div>

            {/* Category Breakdown */}
            <CategoryBreakdown
              data={metrics.byCategory}
              title={`Resolution Time by Category (Last ${daysBack || 30} Days)`}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Metrics;
