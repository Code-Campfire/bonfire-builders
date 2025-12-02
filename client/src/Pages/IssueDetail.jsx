import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Building2, Phone, Mail, Home, Trash2, Edit } from 'lucide-react';
import { issueAPI } from '../services/api';

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const data = await issueAPI.getIssueById(id);
      setIssue(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching issue:', err);
      setError('Failed to load issue details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await issueAPI.deleteIssue(id);
      navigate('/issues');
    } catch (err) {
      console.error('Error deleting issue:', err);
      alert('Failed to delete issue. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/issues/${id}/edit`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button and Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/issues')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Issues</span>
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Issue</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'Deleting...' : 'Delete Issue'}</span>
            </button>
          </div>
        </div>

        {/* Issue Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{issue.title}</h2>
          <div className="mb-4">
            <span className="text-gray-500">Status: </span>
            <span className={`font-medium ${issue.status === 'Open' ? 'text-green-500' : 'text-red-500'}`}>
              {issue.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-gray-500">Created At:</span>
              <span className="block font-medium">{new Date(issue.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Due Date:</span>
              <span className="block font-medium">{new Date(issue.dueDate).toLocaleString()}</span>
            </div>
          </div>
          <div className="mb-4">
            <span className="text-gray-500">Description:</span>
            <p className="mt-2 text-gray-700">{issue.description}</p>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-gray-500">Assigned To:</span>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="font-medium">
                  {issue.assignedTo ? `${issue.assignedTo.first_name} ${issue.assignedTo.last_name}` : 'Unassigned'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Location:</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{issue.location || 'N/A'}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Contact:</span>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{issue.user?.phone || 'N/A'}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{issue.user?.email || 'N/A'}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Unit:</span>
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{issue.user?.apartment_number || 'N/A'}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Submitted By:</span>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="font-medium">
                  {issue.user ? `${issue.user.first_name} ${issue.user.last_name}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}