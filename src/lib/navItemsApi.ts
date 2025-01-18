import { ApiOptions, ApiResponse, NavItem } from "../types/NavTypes";

const baseURL = "http://localhost:5000/api/v1/nav-items";

// Centralized API request handler
const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, options);
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
  apiRequest<ApiResponse>("/get-all-nav-items");

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
    body: JSON.stringify(updatedData),
  });

// Toggle delete video
export const isShow = (id: string) =>
  apiRequest(`/toggle-show/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
