import { ApiOptions, ApiResponse, NavItem } from "../types/NavTypes";
const BASE_URL_FROM_ENV = import.meta.env.VITE_BASE_URL;

const baseURL = `${BASE_URL_FROM_ENV}/api/v1/nav-items`;

// Centralized API request handler
const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      credentials: "include", // Ensures cookies are included with the request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    throw error;
  }
};

// Fetch all navigation items
export const fetchNavItems = (): Promise<ApiResponse> =>
  apiRequest<ApiResponse>("/get-all-nav-items", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

// Update navigation item by ID
export const updateNavItems = (
  navItemId: string,
  updatedData: Partial<NavItem>
): Promise<NavItem> =>
  apiRequest<NavItem>(`/update-nav-item/${navItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensures cookies are sent with the request
    body: JSON.stringify(updatedData), // Send only the data that needs to be updated
  });

// Toggle visibility of a nav item
export const isShow = (id: string): Promise<void> =>
  apiRequest<void>(`/toggle-show/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensures cookies are sent with the request
  });

// Fetch all navigation items for a specific user
export const fetchNavItemsByUser = (
  userId: string
): Promise<ApiResponse<NavItem[]>> =>
  apiRequest<ApiResponse<NavItem[]>>(`/get-nav-items-by-user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
