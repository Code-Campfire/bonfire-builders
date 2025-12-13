import axios from "axios";

// Base URL for API - adjust based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Issue API calls
export const issueAPI = {
  // Get all issues
  getAllIssues: async () => {
    try {
      const response = await api.get("/issues");
      return response.data;
    } catch (error) {
      console.error("Error fetching issues:", error);
      throw error;
    }
  },

  // Get single issue by ID
  getIssueById: async (id) => {
    try {
      const response = await api.get(`/issues/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching issue:", error);
      throw error;
    }
  },

  // Create new issue
  createIssue: async (issueData) => {
    try {
      const response = await api.post("/issues", issueData);
      return response.data;
    } catch (error) {
      console.error("Error creating issue:", error);
      throw error;
    }
  },

  // Update existing issue
  updateIssue: async (id, issueData) => {
    try {
      const response = await api.put(`/issues/${id}`, issueData);
      return response.data;
    } catch (error) {
      console.error("Error updating issue:", error);
      throw error;
    }
  },

  // Delete issue
  deleteIssue: async (id) => {
    try {
      await api.delete(`/issues/${id}`);
    } catch (error) {
      console.error("Error deleting issue:", error);
      throw error;
    }
  },

  // Get messages for an issue
  getIssueMessages: async (id) => {
    try {
      const response = await api.get(`/issues/${id}/messages`);
      return response.data;
    } catch (error) {
      console.error("Error fetching issue messages:", error);
      throw error;
    }
  },

  // Send a message for an issue
  sendMessage: async (issueId, messageText) => {
    try {
      const response = await api.post('/messages', {
        issue_id: issueId,
        message_text: messageText
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};

// User API calls
export const userAPI = {
  loginUser: async (userCredentials) => {
    try {
      const response = await api.post(`/auth/login`, userCredentials);
      return response.data;
    } catch (error) {
      console.error("Error authenticating user: ", error);
      throw error;
    }
  },
  registerUser: async (userCredentials) => {
    try {
      const response = await api.post(`/auth/register`, userCredentials);
      return response.data;
    } catch (error) {
      console.error("Error authenticating user: ", error);
      throw error;
    }
  },
  updateUser: async (user) => {
    try {
      const response = await api.put(`/users/${user.id}`, user);
      return response.data;
    } catch (error) {
      console.error("Error updating user");
      throw error;
    }
  },
};

export const complexAPI = {
  createComplex: async (apartmentComplexFormData) => {
    try {
      const response = await api.post("/complexes", apartmentComplexFormData);
      return response.data;
    } catch (error) {
      console.error("Error creating complex in database", error);
      throw error;
    }
  },
};

// Photo API calls
export const photoAPI = {
  // Delete photo
  deletePhoto: async (photoId) => {
    try {
      await api.delete(`/photos/${photoId}`);
    } catch (error) {
      console.error("Error deleting photo:", error);
      throw error;
    }
  },
  // Get presigned URLs for upload
  getPresignedUrls: async (files) => {
    try {
      const response = await api.post("/photos/presigned-urls", { files });
      return response.data;
    } catch (error) {
      console.error("Error getting presigned URLs:", error);
      throw error;
    }
  },
    updatePhoto: async (photo) => {
    try{
      const response = await api.put(`/photos/${photo.id}`, photo)
      return response.data
    } catch (error) {
      console.error("Error updating photo", error)
      throw error
    }
  }
};

export default api;
