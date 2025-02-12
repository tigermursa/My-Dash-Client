import { Controller, UseFormHandleSubmit, Control } from "react-hook-form";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { CreateProject } from "../../types/ProjectTypes";

interface ProjectFormProps {
  control: Control<CreateProject>;
  handleSubmit: UseFormHandleSubmit<CreateProject>;
  onSubmit: (data: CreateProject) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  control,
  handleSubmit,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          onClick={onCancel}
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
          Save Project
        </motion.button>
      </div>
    </form>
  );
};

export default ProjectForm;
