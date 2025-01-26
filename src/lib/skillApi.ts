import {
  ApiOptions,
  Skill,
  SkillResponse,
  SkillRequestPayload,
} from "../types/SkillTypes";

const baseURL = "http://localhost:5000/api/v5/skills";

const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
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

// Skill API functions
export const getSkills = async (userID: string): Promise<Skill[]> => {
  const response = await apiRequest<SkillResponse>(`/get-skills/${userID}`, {
    method: "GET",
  });
  return response.skills || [];
};

export const createSkill = async (
  payload: SkillRequestPayload
): Promise<Skill> => {
  const response = await apiRequest<SkillResponse>(`/create`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return response.skill!;
};

export const updateSkill = async (
  skillId: string,
  payload: SkillRequestPayload
): Promise<Skill> => {
  const response = await apiRequest<SkillResponse>(`/update/${skillId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return response.skill!;
};

export const deleteSkill = async (
  userID: string,
  skillId: string
): Promise<boolean> => {
  const response = await apiRequest<SkillResponse>(`/delete/${skillId}`, {
    method: "DELETE",
    body: JSON.stringify({ userID }),
    headers: { "Content-Type": "application/json" },
  });
  return response.success;
};
