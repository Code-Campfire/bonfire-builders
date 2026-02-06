import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import IssueCard from "../components/IssueCard";
import IssueForm from "../Components/issueForm";
import { issueAPI } from "../services/api";
import { IssueFilters } from "../Components/IssueFilters";
import { getButtonClasses } from "../styles/helpers";
import { colors, alerts, loadingStyles } from "../styles/colors";
import { typography } from "../styles/typography";
import { spacing, flexRow, flexCol, flexWrap } from "../styles/layout";
import { toast } from "sonner";

const Issues = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Derive filters from URL search params (URL is the source of truth)
  const filters = {
    status: searchParams.get("status") || "all",
    priority: searchParams.get("priority") || "all",
    category: searchParams.get("category") || "all",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  };

  // Check if URL indicates we should show the form
  useEffect(() => {
    if (location.pathname === "/issues/new") {
      setShowForm(true);
    } else if (location.pathname === "/issues") {
      setShowForm(false);
    }
  }, [location.pathname]);

  // Fetch issues when component mounts
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await issueAPI.getAllIssues();
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      setError("Failed to load issues. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIssue = async (newIssue) => {
    try {
      setSubmitting(true);
      setError(null);

      // Call the API to create the issue
      const createdIssue = await issueAPI.createIssue(newIssue);

      // Add the new issue to the list
      setIssues([createdIssue, ...issues]);
      setShowForm(false);
      navigate("/issues");

      // Show success message (you could use a toast notification library)
      toast.success("Issue reported successfully!");
    } catch (err) {
      console.error("Failed to submit issue:", err);
      setError("Failed to submit issue. Please try again.");
      // Don't close the form so user can retry
    } finally {
      setSubmitting(false);
    }
  };
  // filterKey, value
  const handleFiltersChange = (filterKey, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "all" || value === "") {
      newParams.delete(filterKey);
    } else {
      newParams.set(filterKey, value);
    }
    setSearchParams(newParams, { replace: true });
  };

  // Filter issues based on current filters
  const filteredIssues = issues.filter((issue) => {
    // Status filter
    if (filters.status !== "all" && issue.status !== filters.status) {
      return false;
    }
    // Priority filter
    if (filters.priority !== "all" && issue.priority !== filters.priority) {
      return false;
    }
    // Category filter
    if (filters.category !== "all" && issue.category !== filters.category) {
      return false;
    }
    // Date range filter (assuming issue has createdAt field)
    if (
      filters.startDate &&
      new Date(issue.createdAt) < new Date(filters.startDate + "T00:00:00")
    ) {
      return false;
    }

    if (
      filters.endDate &&
      new Date(issue.createdAt) > new Date(filters.endDate + "T23:59:59")
    ) {
      return false;
    }
    return true;
  });

  const handleToggleForm = () => {
    if (showForm) {
      setShowForm(false);
      navigate("/issues");
    } else {
      setShowForm(true);
      navigate("/issues/new");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setError(null);
    navigate("/issues");
  };

  return (
    <div className={spacing.p6}>
      <div className={flexRow.spaceBetween + " mb-6"}>
        <h1 className={typography.h1}>Maintenance Issues</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className={alerts.error + " mb-4 " + flexRow.startStart}>
          <svg
            className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p>{error}</p>
            {!loading && (
              <button
                onClick={fetchIssues}
                className="text-sm underline hover:no-underline mt-1"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      {showForm ? (
        <IssueForm
          onSubmit={handleSubmitIssue}
          onCancel={handleCancelForm}
          isSubmitting={submitting}
        />
      ) : loading ? (
        <div className={flexCol.centerCenter + " py-12"}>
          <svg
            className={loadingStyles.spinner}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className={colors.textMutedForeground}>Loading issues...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className={colors.bgMuted + " text-center py-12 rounded-lg"}>
          <svg
            className={colors.textMutedForeground + " mx-auto h-12 w-12 mb-4"}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className={typography.h3 + " mb-2"}>No issues reported yet</h3>
          <p className={colors.textMutedForeground + " mb-4"}>
            Get started by reporting your first maintenance issue.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className={getButtonClasses("primary")}
          >
            Report New Issue
          </button>
        </div>
      ) : (
        <>
          <IssueFilters
            filters={filters}
            onFilterChange={handleFiltersChange}
          />
          <div className={flexWrap.row}>
            {filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Issues;
