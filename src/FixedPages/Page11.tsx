// Projects.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

import {
  useGetAllProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../lib/projectApi";
import useAuth from "../hooks/useAuth";

import { CreateProject } from "../types/ProjectTypes";
import ProjectForm from "../components/Projects/ProjectsForm";
import ProjectCard from "../components/Projects/ProjectsCard";

type ProjectFormInput = CreateProject;

interface ApiResponse {
  projects: CreateProject[];
}

const Projects: React.FC = () => {
  const { user } = useAuth();
  const userId = user?._id as string;

  // React Query hooks for projects
  const { data, isLoading, isError, refetch } = useGetAllProjects(userId);
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // Local state for modal and selected project (for update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CreateProject | null>(
    null
  );

  // Initialize react-hook-form with default values
  const { control, handleSubmit, reset } = useForm<ProjectFormInput>({
    defaultValues: {
      userId,
      projectName: "",
      category: "frontend",
      githubClient: "",
      githubServer: "",
      liveLink: "",
      priority: "medium",
      status: "planned",
    },
  });

  // Opens the modal for creating a new project or updating an existing one
  const openModal = (project?: CreateProject) => {
    if (project) {
      setSelectedProject(project);
      reset(project); // Pre-fill form with project data for update
    } else {
      setSelectedProject(null);
      reset({
        userId,
        projectName: "",
        category: "frontend",
        githubClient: "",
        githubServer: "",
        liveLink: "",
        priority: "medium",
        status: "planned",
      });
    }
    setIsModalOpen(true);
  };

  // Handle form submission for create/update
  const onSubmit = async (data: ProjectFormInput) => {
    if (selectedProject) {
      await updateProjectMutation.mutateAsync({
        id: selectedProject._id as string,
        data,
      });
    } else {
      await createProjectMutation.mutateAsync(data);
    }
    setIsModalOpen(false);
    refetch();
  };

  // Handle delete project
  const handleDelete = async (id: string) => {
    await deleteProjectMutation.mutateAsync({ id, userId });
    refetch();
  };

  if (isLoading)
    return (
      <div className="text-center py-8 text-gray-700 dark:text-white">
        Loading projects...
      </div>
    );
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">
        Error fetching projects.
      </div>
    );
  const projects: CreateProject[] =
    (data as unknown as ApiResponse)?.projects || [];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Projects
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon icon="mdi:plus" className="text-xl" />
          Add Project
        </motion.button>
      </div>

      {/* Modal for Create / Update */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {selectedProject ? "Update Project" : "Add New Project"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <Icon icon="mdi:close" className="text-2xl" />
                </button>
              </div>
              <ProjectForm
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                onCancel={() => setIsModalOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: CreateProject) => (
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={openModal}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
