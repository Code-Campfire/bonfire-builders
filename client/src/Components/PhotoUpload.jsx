import { useState } from "react";
import { photoAPI } from "../services/api";
import { getButtonClasses } from "../styles/helpers";
import { colors, alerts } from "../styles/colors";
import { typography } from "../styles/typography";

export const PhotoUpload = ({ issueId, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      // Reset input even if no files selected
      e.target.value = '';
      return;
    }

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

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setUploadError(null);
    }
    
    // Reset the input value AFTER processing so the same file can be selected again
    setTimeout(() => {
      e.target.value = '';
    }, 100);
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

      const savedPhotos = await photoAPI.savePhotoMetadata(photoMetadata, issueId);

      // Clear selection and refresh
      setSelectedFiles([]);
      
      // Reset the file input
      const fileInput = document.getElementById("photo-upload");
      if (fileInput) {
        fileInput.value = '';
      }
      
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
        <div className={colors.bgMuted + ' mb-4 p-4 rounded-lg'}>
          <h3 className={typography.label + ' mb-2'}>
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className={typography.smallMuted}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className={alerts.error + ' mb-4'}>
          {uploadError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <label
          htmlFor="photo-upload"
          className={getButtonClasses('primary') + ' cursor-pointer'}
        >
          Select Photos
        </label>

        {selectedFiles.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={getButtonClasses('primary')}
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
