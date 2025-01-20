import { ApiOptions } from "../types/AuthTypes";

const baseURL = "http://localhost:5000/api/v4/notepad";

// Centralized API request handler
const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      credentials: "include", // Automatically include the cookies
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

// API Calls for Notepad
export const getContentNotePad = async (userId: string) => {
  return await apiRequest<{ contentNotePad: string }>(`/notepad/${userId}`, {
    method: "GET",
  });
};

export const getContentIdea = async (userId: string) => {
  return await apiRequest<{ contentIdea: string }>(`/idea/${userId}`, {
    method: "GET",
  });
};

export const updateContentNotePad = async (
  userId: string,
  contentNotePad: string
) => {
  return await apiRequest<{ contentNotePad: string }>(`/notepad/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ contentNotePad }),
    headers: { "Content-Type": "application/json" },
  });
};

export const updateContentIdea = async (
  userId: string,
  contentIdea: string
) => {
  return await apiRequest<{ contentIdea: string }>(`/idea/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ contentIdea }),
    headers: { "Content-Type": "application/json" },
  });
};

export const clearContentNotePad = async (userId: string) => {
  return await apiRequest<{ contentNotePad: string }>(
    `/notepad/clear/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ contentNotePad: "" }),
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const clearContentIdea = async (userId: string) => {
  return await apiRequest<{ contentIdea: string }>(`/idea/clear/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ contentIdea: "" }),
    headers: { "Content-Type": "application/json" },
  });
};
