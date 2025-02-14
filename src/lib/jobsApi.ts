import {
  JobApplication,
  JobRequestPayload,
  JobResponse,
  JobResponseGet,
} from "../types/JobsTypes";
import { ApiOptions } from "../types/SkillTypes";
const BASE_URL_FROM_ENV = import.meta.env.VITE_BASE_URL;

const jobsBaseURL = `${BASE_URL_FROM_ENV}/api/v6/jobs`;

const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  try {
    const response = await fetch(`${jobsBaseURL}${endpoint}`, {
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

// Job API functions
export const fetchJobs = async (userID: string): Promise<JobApplication[]> => {
  return apiRequest<JobResponseGet>(`/get-job-applications/${userID}`).then(
    (response) => response.jobApplications || []
  );
};

export const getJobById = async (
  userID: string,
  jobId: string
): Promise<JobApplication> => {
  return apiRequest<JobResponse>(
    `/get-job-application/${userID}/${jobId}`
  ).then((response) => response.job!);
};

export const createJob = async (
  payload: JobRequestPayload
): Promise<JobApplication> => {
  const response = await apiRequest<JobResponse>(`/create`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return response.job!;
};

export const updateJob = async (
  jobId: string,
  payload: JobRequestPayload
): Promise<JobApplication> => {
  const response = await apiRequest<JobResponse>(`/update/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return response.job!;
};

export const deleteJob = async (
  userID: string,
  jobId: string
): Promise<boolean> => {
  const response = await apiRequest<JobResponse>(`/delete/${jobId}`, {
    method: "DELETE",
    body: JSON.stringify({ userID }),
    headers: { "Content-Type": "application/json" },
  });
  return response.success;
};
