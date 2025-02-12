import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  useGetAllProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  CreateProject,
  Project,
} from "../lib/projectApi";
import useAuth from "../hooks/useAuth";

// We'll use CreateProject as our form input type
type ProjectFormInput = CreateProject;

const Projects = () => {
  const { user } = useAuth();
  const userId = user?._id as string;

  // React Query hooks for projects
  const { data, isLoading, isError, refetch } = useGetAllProjects(userId);
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // Local state for modal and selected project (for update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
  interface ApiResponse {
    projects: Project[];
  }

  // Opens the modal for creating a new project or updating an existing one
  const openModal = (project?: Project) => {
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
        id: selectedProject._id,
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
  //  const experiences = (data as unknown as ApiResponse)?.experiences || [];
  const projects = (data as unknown as ApiResponse)?.projects || [];

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
              <form onSubmit={handleSubmit(onSubmit)}>
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

                {/* Project Name */}
                <div className="relative mb-4">
                  <Icon
                    icon="mdi:folder-outline"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  />
                  <Controller
                    name="projectName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Project Name"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    )}
                  />
                </div>

                {/* Category */}
                <div className="relative mb-4">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full pl-4 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="fullstack">Fullstack</option>
                      </select>
                    )}
                  />
                </div>

                {/* GitHub Client URL */}
                <div className="relative mb-4">
                  <Icon
                    icon="mdi:github"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  />
                  <Controller
                    name="githubClient"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="url"
                        placeholder="GitHub Client URL (optional)"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    )}
                  />
                </div>

                {/* GitHub Server URL */}
                <div className="relative mb-4">
                  <Icon
                    icon="mdi:github"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  />
                  <Controller
                    name="githubServer"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="url"
                        placeholder="GitHub Server URL (optional)"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    )}
                  />
                </div>

                {/* Live Link */}
                <div className="relative mb-4">
                  <Icon
                    icon="mdi:link-variant"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  />
                  <Controller
                    name="liveLink"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="url"
                        placeholder="Live Project URL (optional)"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    )}
                  />
                </div>

                {/* Priority */}
                <div className="relative mb-4">
                  <Controller
                    name="priority"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full pl-4 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    )}
                  />
                </div>

                {/* Status */}
                <div className="relative mb-6">
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full pl-4 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      >
                        <option value="planned">Planned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedProject ? "Update Project" : "Add Project"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project: Project) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {project.projectName}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(project)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Icon icon="mdi:pencil" className="text-xl" />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Icon icon="mdi:trash-can-outline" className="text-xl" />
                </button>
              </div>
            </div>
            <div className="mb-2">
              <p className="text-gray-600 dark:text-gray-300">
                Category: {project.category}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Priority: {project.priority}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Status: {project.status}
              </p>
            </div>
            {project.githubClient && (
              <a
                href={project.githubClient}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-2 text-blue-500 hover:underline"
              >
                GitHub Client
              </a>
            )}
            {project.githubServer && (
              <a
                href={project.githubServer}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-2 text-blue-500 hover:underline"
              >
                GitHub Server
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-500 hover:underline"
              >
                Live Link
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
