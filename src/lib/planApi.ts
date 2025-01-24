import { AllTasks } from "../types/PlanTypes";

const BASE_URL = "http://localhost:5000/api/v3/plan";

type TaskBody = {
  userID: string;
  taskId: string;
};

const handleRequest = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data.data as T;
  } catch (error) {
    console.error(`API Error at ${url}:`, error);
    throw new Error((error as Error).message || "Network error occurred");
  }
};

export const taskAPI = {
  createTask: async (payload: {
    userID: string;
    task: Omit<AllTasks, "id">;
  }): Promise<AllTasks> => {
    return handleRequest("/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getTasks: async (userID: string): Promise<AllTasks[]> => {
    return handleRequest(`/tasks/${userID}`, {
      method: "GET",
    });
  },

  toggleComplete: async (payload: TaskBody): Promise<AllTasks> => {
    return handleRequest("/tasks/completed", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  toggleImportant: async (payload: TaskBody): Promise<AllTasks> => {
    return handleRequest("/tasks/important", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteTask: async (payload: TaskBody): Promise<void> => {
    return handleRequest("/tasks/delete", {
      method: "DELETE",
      body: JSON.stringify(payload),
    });
  },
};
