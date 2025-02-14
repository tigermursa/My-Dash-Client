const BASE_URL = import.meta.env.VITE_BASE_URL;

import {
  ApiOptions,
  Skill,
  SkillResponse,
  SkillRequestPayload,
} from "../types/SkillTypes";

const baseURL = `${BASE_URL}/api/v5/skills`;

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

// Skill API functions (GET)
export const fetchSkills = async (userID: string): Promise<Skill[]> => {
  return apiRequest<{ message: string; skills: Skill[] }>(
    `/get-skills/${userID}`
  ).then((response) =>
    response.skills.map((skill) => ({
      ...skill,
      category: skill.category as
        | "frontend"
        | "backend"
        | "tool"
        | "plan-to-learn",
    }))
  );
};

//(CREATE)
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

//(Update)
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

//(Delete)
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
