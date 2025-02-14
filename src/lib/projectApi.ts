import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProject } from "../types/ProjectTypes";
const BASE_URL_FROM_ENV = import.meta.env.VITE_BASE_URL;

export interface Project extends CreateProject {
  _id: string;
}

const BASE_URL = `${BASE_URL_FROM_ENV}/api/v10/project`;

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  method: string,
  body?: object
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// API functions
export const getAllProjects = (userId: string): Promise<Project[]> => {
  return apiRequest<Project[]>(`/get/${userId}`, "GET");
};

export const createProject = (project: CreateProject): Promise<Project> => {
  return apiRequest<Project>("/create", "POST", project);
};

export const updateProject = (
  id: string,
  project: CreateProject
): Promise<Project> => {
  return apiRequest<Project>(`/update/${id}`, "PUT", project);
};

export const deleteProject = (id: string, userId: string): Promise<void> => {
  return apiRequest<void>(`/delete/${id}`, "DELETE", { userId });
};

// React Query hooks

export const useGetAllProjects = (userId: string) => {
  return useQuery<Project[], Error>({
    queryKey: ["projects", userId],
    queryFn: () => getAllProjects(userId),
    enabled: !!userId, // Only fetch if a userId is provided
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<Project, Error, CreateProject>({
    mutationFn: createProject,
    onSuccess: (data) => {
      // Invalidate and refetch projects for the user upon successful creation
      queryClient.invalidateQueries({ queryKey: ["projects", data.userId] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<Project, Error, { id: string; data: CreateProject }>({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: (data) => {
      // Invalidate projects for the user upon a successful update
      queryClient.invalidateQueries({ queryKey: ["projects", data.userId] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; userId: string }>({
    mutationFn: ({ id, userId }) => deleteProject(id, userId),
    onSuccess: (_, variables) => {
      // Invalidate projects for the user upon deletion
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.userId],
      });
    },
  });
};
