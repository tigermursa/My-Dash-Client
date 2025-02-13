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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group p-6 bg-white w-full max-w-[400px]  mx-auto  dark:bg-gray-800/25 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col h-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-grow">
            <div className="flex items-center mb-3 space-x-2">
              <Icon
                icon="mdi:folder-star"
                className="text-2xl text-primary_one"
              />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
                {project.projectName}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-primary_one/10 text-primary_one rounded-full text-xs font-medium flex items-center gap-1.5">
                <Icon icon="mdi:label" className="text-sm -ml-1" />
                {project.category}
              </span>
              <span className="px-3 py-1.5 bg-primary_one/10 text-primary_one rounded-full text-xs font-medium flex items-center gap-1.5">
                <Icon icon="mdi:priority-high" className="text-sm -ml-1" />
                {project.priority}
              </span>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                  project?.status === "in-progress"
                    ? "bg-red-100/80 text-red-600 dark:bg-red-900/20"
                    : project?.status === "completed"
                    ? "bg-green-100/80 text-green-600 dark:bg-green-900/20"
                    : "bg-primary_one/10 text-primary_one"
                }`}
              >
                <Icon icon="mdi:progress-check" className="text-sm -ml-1" />
                {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="my-4 space-y-3">
          {project.githubClient && (
            <a
              href={project.githubClient}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-primary_one/5 transition-colors duration-200"
            >
              <Icon
                icon="mdi:github"
                className="text-xl text-gray-600 dark:text-gray-300"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                Client Repo
              </span>
              <Icon
                icon="mdi:open-in-new"
                className="ml-auto text-sm text-gray-400"
              />
            </a>
          )}

          {project.githubServer && (
            <a
              href={project.githubServer}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-primary_one/5 transition-colors duration-200"
            >
              <Icon
                icon="mdi:github"
                className="text-xl text-gray-600 dark:text-gray-300"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                Server Repo
              </span>
              <Icon
                icon="mdi:open-in-new"
                className="ml-auto text-sm text-gray-400"
              />
            </a>
          )}

          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-primary_one/5 transition-colors duration-200"
            >
              <Icon
                icon="mdi:web"
                className="text-xl text-gray-600 dark:text-gray-300"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                Live Demo
              </span>
              <Icon
                icon="mdi:open-in-new"
                className="ml-auto text-sm text-gray-400"
              />
            </a>
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(project)}
              className="p-2 hover:bg-primary_one/10 rounded-lg transition-colors duration-200 group"
            >
              <Icon
                icon="mdi:pencil"
                className="text-xl text-gray-500 dark:text-gray-400 group-hover:text-primary_one"
              />
            </button>
            <button
              onClick={() => onDelete(project._id as string)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 group"
            >
              <Icon
                icon="mdi:trash-can-outline"
                className="text-xl text-gray-500 dark:text-gray-400 group-hover:text-red-500"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
