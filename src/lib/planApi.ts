import { AllTasks, Tasks } from "../types/PlanTypes";

const BASE_URL = "http://localhost:5000/api/v3/plan";

type ApiResponse<T> = {
  data?: T;
  error?: string;
};

type TaskBody = {
  userID: string;
  taskId: string;
};

const handleRequest = async <T>(
  url: string,
  options: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Request failed" };
    }

    return { data: await response.json() };
  } catch (error) {
    console.error(`API Error at ${url}:`, error);
    return { error: "Network error occurred" };
  }
};

// Task Operations
export const taskAPI = {
  createTask: async (payload: {
    userID: string;
    task: Omit<AllTasks, "id">;
  }): Promise<ApiResponse<Tasks>> => {
    return handleRequest("/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getTasks: async (userID: string): Promise<ApiResponse<AllTasks[]>> => {
    return handleRequest(`/tasks/${userID}`, {
      method: "GET",
    });
  },

  toggleImportant: async (
    payload: TaskBody
  ): Promise<ApiResponse<AllTasks>> => {
    return handleRequest("/tasks/important", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  toggleComplete: async (payload: TaskBody): Promise<ApiResponse<AllTasks>> => {
    return handleRequest("/tasks/complete", {
      // Changed endpoint
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteTask: async (payload: TaskBody): Promise<ApiResponse<void>> => {
    return handleRequest("/tasks/delete", {
      // Changed endpoint
      method: "DELETE",
      body: JSON.stringify(payload),
    });
  },
};
