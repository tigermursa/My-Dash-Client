import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateBookmark } from "../types/BookmarksTypes";

// Define the bookmark interfaces

export interface Bookmark extends CreateBookmark {
  _id: string;
}

const BASE_URL = "http://localhost:5000/api/v7/bookmarks";

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
export const getAllBookmarks = (userId: string): Promise<Bookmark[]> => {
  return apiRequest<Bookmark[]>(`/get/${userId}`, "GET");
};

export const createBookmark = (bookmark: CreateBookmark): Promise<Bookmark> => {
  return apiRequest<Bookmark>("/create", "POST", bookmark);
};

export const updateBookmark = (
  id: string,
  bookmark: CreateBookmark
): Promise<Bookmark> => {
  return apiRequest<Bookmark>(`/update/${id}`, "PUT", bookmark);
};

export const deleteBookmark = (id: string, userId: string): Promise<void> => {
  return apiRequest<void>(`/delete/${id}`, "DELETE", { userId });
};

// React Query hooks
export const useGetAllBookmarks = (userId: string) => {
  return useQuery<Bookmark[], Error>({
    queryKey: ["bookmarks", userId],
    queryFn: () => getAllBookmarks(userId),
    enabled: !!userId, // Only fetch when userId is available
  });
};

export const useCreateBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation<Bookmark, Error, CreateBookmark>({
    mutationFn: createBookmark,
    onSuccess: (data) => {
      // Invalidate and refetch bookmarks for the user after a successful creation
      queryClient.invalidateQueries({ queryKey: ["bookmarks", data.userId] });
    },
  });
};

export const useUpdateBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation<Bookmark, Error, { id: string; data: CreateBookmark }>({
    mutationFn: ({ id, data }) => updateBookmark(id, data),
    onSuccess: (data) => {
      // Invalidate bookmarks for the user after an update
      queryClient.invalidateQueries({ queryKey: ["bookmarks", data.userId] });
    },
  });
};

export const useDeleteBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; userId: string }>({
    mutationFn: ({ id, userId }) => deleteBookmark(id, userId),
    onSuccess: (_, variables) => {
      // Invalidate bookmarks for the user after deletion
      queryClient.invalidateQueries({
        queryKey: ["bookmarks", variables.userId],
      });
    },
  });
};
