import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateEvent } from "../types/EventTypes";

export interface Event extends CreateEvent {
  _id: string;
}

const BASE_URL = "http://localhost:5000/api/v8/events";

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
export const getAllDateEvents = (userId: string): Promise<Event[]> => {
  return apiRequest<Event[]>(`/get/${userId}`, "GET");
};

export const createDateEvent = (event: CreateEvent): Promise<Event> => {
  return apiRequest<Event>("/create", "POST", event);
};

export const updateDateEvent = (
  id: string,
  event: CreateEvent
): Promise<Event> => {
  return apiRequest<Event>(`/update/${id}`, "PUT", event);
};

export const deleteDateEvent = (id: string, userId: string): Promise<void> => {
  return apiRequest<void>(`/delete/${id}`, "DELETE", { userId });
};

// Query hooks
export const useGetAllDateEvents = (userId: string) => {
  return useQuery<Event[], Error>({
    queryKey: ["events", userId],
    queryFn: () => getAllDateEvents(userId),
    enabled: !!userId, // Only fetch when userId is available
  });
};

export const useCreateDateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<Event, Error, CreateEvent>({
    mutationFn: createDateEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events", data.userId] });
    },
  });
};

export const useUpdateDateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<Event, Error, { id: string; data: CreateEvent }>({
    mutationFn: ({ id, data }) => updateDateEvent(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events", data.userId] });
    },
  });
};

export const useDeleteDateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; userId: string }>({
    mutationFn: ({ id, userId }) => deleteDateEvent(id, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events", variables.userId] });
    },
  });
};
