import { ApiOptions } from "../types/AuthTypes";
const BASE_URL_FROM_ENV = import.meta.env.VITE_BASE_URL;

const baseURL = `${BASE_URL_FROM_ENV}/api/v4/notepad`;

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
// Updated API functions with proper typing
export const getContentNotePad = async (userId: string) => {
  const response = await apiRequest<{ contentNotePad: string }>(
    `/notepad/${userId}`,
    {
      method: "GET",
    }
  );
  return { content: response.contentNotePad };
};

export const getContentIdea = async (userId: string) => {
  const response = await apiRequest<{ contentIdea: string }>(
    `/idea/${userId}`,
    {
      method: "GET",
    }
  );
  return { content: response.contentIdea };
};

export const updateContentNotePad = async (
  userId: string,
  contentNotePad: string
) => {
  await apiRequest<void>(`/notepad/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ contentNotePad }),
    headers: { "Content-Type": "application/json" },
  });
};

export const updateContentIdea = async (
  userId: string,
  contentIdea: string
) => {
  await apiRequest<void>(`/idea/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ contentIdea }),
    headers: { "Content-Type": "application/json" },
  });
};

export const clearContentNotePad = async (userId: string) => {
  await apiRequest<void>(`/notepad/clear/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ contentNotePad: "" }),
    headers: { "Content-Type": "application/json" },
  });
};

export const clearContentIdea = async (userId: string) => {
  await apiRequest<void>(`/idea/clear/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ contentIdea: "" }),
    headers: { "Content-Type": "application/json" },
  });
};
