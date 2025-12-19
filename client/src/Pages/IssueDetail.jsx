import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { PhotoUpload } from "../Components/PhotoUpload";
import { formatCategory } from "@/utils/categoryUtils";
import { getDaysAgo } from "@/utils/dateUtils";
import { issueAPI, photoAPI } from "../services/api";
import {
  Calendar,
  Camera,
  MessageSquare,
  User,
  MapPin,
  Clock,
  CheckCircle,
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Edit,
  Trash2,
  X,
  Pencil,
} from "lucide-react";
import { Messages } from "../Components/messaging/Messages";
import { useAuth } from '../context/context';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCaptionId, setEditingCaptionId] = useState(null);
  const [editingCaptionText, setEditingCaptionText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchIssueDetail();
  }, [id]);

  useEffect(() => {
    if (issue) {
      const allowedStatuses = ['IN_PROGRESS', 'RESOLVED', 'CLOSED'];
      setSelectedStatus(allowedStatuses.includes(issue.status) ? issue.status : '');
    }
  }, [issue]);

  const fetchIssueDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await issueAPI.getIssueById(id);
      console.log('Fetched issue data:', data);
      setIssue(data);
    } catch (err) {
      console.error("Failed to fetch issue:", err);
      setError("Failed to load issue details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageUpdate = useCallback((updatedMessages) => {
    setIssue(prev => ({ ...prev, messages: updatedMessages}))
  }, []);

  const handleBack = () => {
    navigate("/issues");
  };

  const handleEdit = () => {
    navigate(`/issues/${id}/edit`);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this issue? This action cannot be undone."
      )
    ) {
      try {
        await issueAPI.deleteIssue(id);
        navigate("/issues");
      } catch (err) {
        console.error("Failed to delete issue:", err);
        alert("Failed to delete issue. Please try again.");
      }
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      await photoAPI.deletePhoto(photoId);
      setIssue((prevIssue) => ({
        ...prevIssue,
        photos: prevIssue.photos.filter((p) => p.id !== photoId),
      }));
    } catch (err) {
      console.error("Failed to delete photo:", err);
      alert("Failed to delete photo. Please try again.");
    }
  };

  const handleEditCaption = (photo) => {
    setEditingCaptionId(photo.id);
    setEditingCaptionText(photo.caption);
  };

  const handleSaveCaption = async (photoId) => {
    try {
      const updatedPhoto = {
        id: photoId,
        caption: editingCaptionText,
      };

      await photoAPI.updatePhoto(updatedPhoto);

      // Update local state
      setIssue((prevIssue) => ({
        ...prevIssue,
        photos: prevIssue.photos.map((photo) =>
          photo.id === photoId
            ? { ...photo, caption: editingCaptionText }
            : photo
        ),
      }));

      // Exit edit mode
      setEditingCaptionId(null);
      setEditingCaptionText("");
    } catch (err) {
      console.error("Failed to update caption:", err);
      alert("Failed to update caption. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingCaptionId(null);
    setEditingCaptionText("");
  };

  const handleCaptionChange = (e) => {
    // Destructs the id and value keys from the input
    const { id, value } = e.target;

    // Separates photos from the issue object
    const photosArray = issue.photos;

    // Filters photos by id
    let filteredPhotoArray = photosArray.filter((photo) => {
      return photo.id === parseInt(id);
    });

    // Extracts unique photo from filter array
    const uniquePhoto = filteredPhotoArray[0];

    // Updates caption property on the unique photo
    uniquePhoto.caption = value;
  };

  const handleCaptionUpdate = async (e) => {
    // Prevents page refresh before API call
    e.preventDefault();

    // Destructs id from button input
    const { id } = e.target;

    // Separates photos from the issue object
    const photosArray = issue.photos;

    // Filters photos by id
    let filteredPhotoArray = photosArray.filter((photo) => {
      return photo.id === parseInt(id);
    });

    // Extracts unique photo from filter array
    const uniquePhoto = filteredPhotoArray[0];

    // Sends unique photo to be updated in database
    await photoAPI.updatePhoto(uniquePhoto);

    // Update local state for photos instead of fetching entire issue
    setIssue((prevIssue) => ({
      ...prevIssue,
      photos: prevIssue.photos.map((photo) =>
        photo.id === uniquePhoto.id ? uniquePhoto : photo
      ),
    }));
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === issue.status) return;

    try {
      setUpdatingStatus(true);
      await issueAPI.updateIssue(id, { status: selectedStatus });
      await fetchIssueDetail();
      alert('Status updated successfully');
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
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
          </div>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Issues
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error || "Issue not found"}</p>
            <button
              onClick={fetchIssueDetail}
              className="text-sm underline hover:no-underline mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-700 hover:text-rose-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Maintenance Requests 
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit Issue
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Issue
            </button>
          </div>
        </div>

        {/* Main Issue Card */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{issue.title}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                  <span className="px-3 py-1 bg-secondary rounded-md text-sm font-medium">
                    {formatCategory(issue.category)}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1 justify-end mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs">
                  Updated {getDaysAgo(issue.updatedAt)}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-black-700 whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>

            {/* Location */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Location:</span>
                <span>{issue.location}</span>
              </div>
            </div>

            {/* Tenant Information */}
            {issue.user && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Reported By
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>
                      {issue.user.first_name} {issue.user.last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{issue.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Unit:</span>
                    <span>{issue.user.apartment_number}</span>
                  </div>
                  {issue.user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Phone:</span>
                      <span>{issue.user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Complex Information */}
            {issue.complex && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Property
                </h2>
                <div className="text-sm">
                  <div className="font-medium">{issue.complex.name}</div>
                  {issue.user?.building_name && (
                    <div className="text-gray-700">
                      Building: {issue.user.building_name}
                    </div>
                  )}
                  <div className="text-gray-600">{issue.complex.address}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Update Card */}
        {user?.role === 'LANDLORD' && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-bold">Update Status</h2>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Select new status</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus || !selectedStatus || selectedStatus === issue?.status}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline Card */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Created Event */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Issue Created</span>
                    <StatusBadge status="OPEN" />
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(issue.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Reported by {issue.user?.first_name} {issue.user?.last_name}
                  </div>
                </div>
              </div>

              {/* Acknowledged Event */}
              {issue.acknowledged_date && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">Issue Acknowledged</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(issue.acknowledged_date).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Management has been notified
                    </div>
                  </div>
                </div>
              )}

              {/* Resolved Event */}
              {issue.resolved_date && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Issue Resolved</span>
                      <StatusBadge status="RESOLVED" />
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(issue.resolved_date).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Issue has been fixed
                    </div>
                  </div>
                </div>
              )}

              {/* Closed Event */}
              {issue.closed_date && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Issue Closed</span>
                      <StatusBadge status="CLOSED" />
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(issue.closed_date).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Issue marked as complete
                    </div>
                  </div>
                </div>
              )}

              {/* Current Status if Still Open */}
              {!issue.closed_date && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Current Status</span>
                      <StatusBadge status={issue.status} />
                    </div>
                    <div className="text-sm text-gray-500">
                      {issue.status === "OPEN" &&
                        "Awaiting response from management"}
                      {issue.status === "IN_PROGRESS" && "Work in progress"}
                      {issue.status === "RESOLVED" &&
                        "Awaiting tenant confirmation"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Photos Section */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photos ({issue.photos?.length || 0})
            </h2>
          </CardHeader>
          <CardContent>
            {issue.photos && issue.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {issue.photos.map((photo) => (
                  <div key={photo.id} className="space-y-2">
                    <div className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={photo.file_path}
                        alt={photo.caption || "Issue photo"}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      {photo.caption ? (
                        editingCaptionId === photo.id ? (
                          // Edit mode
                          <div className="space-y-2">
                            <textarea
                              className="w-full text-sm p-2 border rounded"
                              value={editingCaptionText}
                              onChange={(e) =>
                                setEditingCaptionText(e.target.value)
                              }
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveCaption(photo.id)}
                                className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-sm px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <div className="text-sm text-gray-700 flex flex-row justify-between items-start p-2 rounded hover:bg-gray-50 group">
                            <div className="flex-1">{photo.caption}</div>
                            <button
                              onClick={() => handleEditCaption(photo)}
                              className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        )
                      ) : (
                        // No caption yet - add caption mode
                        <div className="space-y-2">
                          <textarea
                            className="w-full text-sm p-2 border rounded"
                            placeholder="Caption..."
                            id={photo.id}
                            onChange={handleCaptionChange}
                          />
                          <button
                            id={photo.id}
                            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleCaptionUpdate}
                          >
                            Add Caption
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No photos uploaded yet</p>
              </div>
            )}

            <PhotoUpload
              issueId={id}
              onUploadComplete={(newPhotos) => {
                setIssue((prevIssue) => {
                  const updatedIssue = {
                    ...prevIssue,
                    photos: [
                      ...prevIssue.photos,
                      ...(Array.isArray(newPhotos) ? newPhotos : [newPhotos]),
                    ],
                  };

                  return updatedIssue;
                });
              }}
            />
          </CardContent>
        </Card>

        {/* Messages Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages ({issue.messages?.length || 0})
            </h2>
          </CardHeader>
          <CardContent>
            <Messages 
              issue={issue} 
              fetchIssueDetail={fetchIssueDetail} 
              onMessageUpdate={handleMessageUpdate} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IssueDetail;
