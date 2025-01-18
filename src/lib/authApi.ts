const baseURL = "http://localhost:5000/api/v2/user";

// Interface for API options
interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

// User Interface
export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  isDeleted: boolean;
}

interface GetUserResponse {
  success: boolean;
  message: string;
  data: IUser;
}

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

// **Signup API Call**
export const signupUser = async (
  userData: Pick<IUser, "username" | "email" | "password">
) => {
  return apiRequest<IUser>("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};

// **Signin API Call**
export const signinUser = async (
  credentials: Pick<IUser, "email" | "password">
) => {
  return apiRequest<{ token: string; user: IUser }>("/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
};

// **Signout API Call**
export const signoutUser = async (): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>("/signout", {
    method: "POST",
  });
};

// **Get User by ID API Call**
export const getUserById = async (userId: string): Promise<GetUserResponse> => {
  return await apiRequest<GetUserResponse>(`/get-user/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export default apiRequest;
