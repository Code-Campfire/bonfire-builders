import axios from "axios";

// Base URL for API - adjust based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
};

// User API calls
export const userAPI = {
  // Login User
  loginUser: async (userCredentials) => {
    try {
      const response = await api.post(`/auth/login`);
      return response.data;
    } catch (error) {
      console.error('Error authenticating user: ', error);
      throw error;
    }
  }
}





export default api;
