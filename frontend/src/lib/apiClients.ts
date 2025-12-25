import axios from "axios";

const API_URL = "https://itenerary-generator-production.up.railway.app";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Get token from LocalStorage (we'll store it there after login)
    const token = localStorage.getItem("accessToken"); // "accessToken" can be changed to any other name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    // .post <=> HTTP method POST: Create new user
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    // .post <=> HTTP method POST: Create new token
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    // .post <=> HTTP method POST: Create new access token
    const response = await apiClient.post("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  logout: async () => {
    // .post <=> HTTP method POST: State-changing action (invalidates session)
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};

//Itinerary API functions
export const itineraryAPI = {
  generate: async (data: {
    destination: string;
    startDate: string;
    endDate: string;
    budget?: string; // Optional
    interests?: string[]; // Optional
    pace?: string; // Optional
  }) => {
    const response = await apiClient.post("/itineraries/generate", data);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get("/itineraries");
    return response.data;
  },

  getByID: async (id: string) => {
    const response = await apiClient.get(`/itineraries/${id}`);
    return response.data;
  },

  update: async (id: string, data: any) => {
    // patch <=> Partial update (Only change some categories)
    // put <=> Full replacement
    const response = await apiClient.patch(`/itineraries/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/itineraries/${id}`);
    return response.data;
  },
};

// Billing API functions
export const billingAPI = {
  createCheckoutSession: async (plan: string) => {
    const response = await apiClient.post("/billing/create-checkout-session", {
      plan,
    });
    return response.data;
  },

  getStatus: async () => {
    const response = await apiClient.get("/billing/me");
    return response.data;
  },
};
