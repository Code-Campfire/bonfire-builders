import { useState, useEffect } from 'react';
import IssueCard from '../Components/IssueCard';
import IssueForm from '../Components/IssueForm';
import { issueAPI } from '../services/api';

const Issues = () => {
  const [showForm, setShowForm] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      console.error('Failed to fetch issues:', err);
      setError('Failed to load issues. Please try again later.');
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
      
      // Show success message (you could use a toast notification library)
      alert('Issue submitted successfully!');
    } catch (err) {
      console.error('Failed to submit issue:', err);
      setError('Failed to submit issue. Please try again.');
      // Don't close the form so user can retry
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Maintenance Issues</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {showForm ? 'View Issues' : 'Report New Issue'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
          onCancel={() => {
            setShowForm(false);
            setError(null);
          }}
          isSubmitting={submitting}
        />
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading issues...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No issues reported yet</h3>
          <p className="text-gray-600 mb-4">Get started by reporting your first maintenance issue.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Report New Issue
          </button>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap gap-4">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Issues;