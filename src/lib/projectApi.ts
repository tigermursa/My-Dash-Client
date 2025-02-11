// projectApi.ts
import {
  Project,
  ProjectRequestPayload,
  ProjectResponse,
  ProjectResponseGet,
} from "../types/ProjectType";
import { ApiOptions } from "../types/SkillTypes";

const projectBaseURL = "http://localhost:5000/api/v10/project";

const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  try {
    const response = await fetch(`${projectBaseURL}${endpoint}`, {
      ...options,
      credentials: "include",
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

// Project API functions

/**
 * Fetch all projects for a given user.
 * GET /get/:userId
 */
export const fetchProjects = async (userId: string): Promise<Project[]> => {
  return apiRequest<ProjectResponseGet>(`/get/${userId}`).then(
    (response) => response.projects || []
  );
};

/**
 * Create a new project.
 * POST /create
 */
export const createProject = async (
  payload: ProjectRequestPayload
): Promise<Project> => {
  const response = await apiRequest<ProjectResponse>(`/create`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return response.project;
};

/**
 * Update an existing project.
 * PUT /update/:id
 */
export const updateProject = async (
  id: string,
  payload: ProjectRequestPayload
): Promise<Project> => {
  const response = await apiRequest<ProjectResponse>(`/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return response.project;
};

/**
 * Delete a project.
 * DELETE /delete/:id
 * Note: The endpoint expects the userId in the request body.
 */
export const deleteProject = async (
  userId: string,
  id: string
): Promise<boolean> => {
  const response = await apiRequest<ProjectResponse>(`/delete/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ userId }),
    headers: { "Content-Type": "application/json" },
  });
  return response.success;
};
