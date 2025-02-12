import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import type { CreateProject as Project } from "../../types/ProjectTypes";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
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
            onClick={() => onEdit(project)}
            className="text-blue-500 hover:text-blue-600"
          >
            <Icon icon="mdi:pencil" className="text-xl" />
          </button>
          <button
            onClick={() => onDelete(project._id as string)}
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
  );
};

export default ProjectCard;
