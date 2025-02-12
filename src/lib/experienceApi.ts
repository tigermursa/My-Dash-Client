import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define the Experience interfaces

export interface CreateExperience {
  userId: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Experience extends CreateExperience {
  _id: string;
}

const BASE_URL = "http://localhost:5000/api/v9/experience";

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

export const getAllExperiences = (userId: string): Promise<Experience[]> => {
  return apiRequest<Experience[]>(`/get/${userId}`, "GET");
};

export const createExperience = (
  experience: CreateExperience
): Promise<Experience> => {
  return apiRequest<Experience>("/create", "POST", experience);
};

export const updateExperience = (
  id: string,
  experience: CreateExperience
): Promise<Experience> => {
  return apiRequest<Experience>(`/update/${id}`, "PUT", experience);
};

export const deleteExperience = (id: string, userId: string): Promise<void> => {
  return apiRequest<void>(`/delete/${id}`, "DELETE", { userId });
};

// React Query hooks

export const useGetAllExperiences = (userId: string) => {
  return useQuery<Experience[], Error>({
    queryKey: ["experiences", userId],
    queryFn: () => getAllExperiences(userId),
    enabled: !!userId, // Only fetch when a userId is provided
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation<Experience, Error, CreateExperience>({
    mutationFn: createExperience,
    onSuccess: (data) => {
      // Invalidate and refetch experiences for the user after a successful creation
      queryClient.invalidateQueries({ queryKey: ["experiences", data.userId] });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation<Experience, Error, { id: string; data: CreateExperience }>(
    {
      mutationFn: ({ id, data }) => updateExperience(id, data),
      onSuccess: (data) => {
        // Invalidate experiences for the user after a successful update
        queryClient.invalidateQueries({
          queryKey: ["experiences", data.userId],
        });
      },
    }
  );
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; userId: string }>({
    mutationFn: ({ id, userId }) => deleteExperience(id, userId),
    onSuccess: (_, variables) => {
      // Invalidate experiences for the user after deletion
      queryClient.invalidateQueries({
        queryKey: ["experiences", variables.userId],
      });
    },
  });
};
