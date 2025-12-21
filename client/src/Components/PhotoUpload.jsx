import { useState } from "react";
import { photoAPI } from "../services/api";

export const PhotoUpload = ({ issueId, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Validate files
    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are allowed");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setUploadError("Files must be less than 5MB");
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      // Get presigned URLs
      const fileMetadata = selectedFiles.map((file) => ({
        name: file.name,
        type: file.type,
      }));

      const { presignedUrls } = await photoAPI.getPresignedUrls(fileMetadata);

      // Upload each file to S3
      await Promise.all(
        selectedFiles.map(async (file, index) => {
          const { uploadUrl } = presignedUrls[index];

          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });

          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }
        })
      );

      // Call backend to save photo metadata to database
      const photoMetadata = selectedFiles.map((file, index) => ({
        fileUrl: presignedUrls[index].fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        caption: "",
      }));

      const saveResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/photos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photos: photoMetadata,
            issueId: issueId,
          }),
        }
      );

      if (!saveResponse.ok) {
        throw new Error("Failed to save photo metadata");
      }

      // Clear selection and refresh
      setSelectedFiles([]);
      const savedPhotos = await saveResponse.json();
      onUploadComplete(savedPhotos);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-6">
      {/* File Input (hidden) */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id="photo-upload"
        disabled={uploading}
      />

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="text-sm text-gray-600">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {uploadError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <label
          htmlFor="photo-upload"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Select Photos
        </label>

        {selectedFiles.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {uploading
              ? "Uploading..."
              : `Upload ${selectedFiles.length} Photo${
                  selectedFiles.length > 1 ? "s" : ""
                }`}
          </button>
        )}
      </div>
    </div>
  );
};
