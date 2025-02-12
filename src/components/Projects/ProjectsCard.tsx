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
      className="group p-6 bg-white w-full max-w-[350px]  mx-auto  dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col h-full  justify-center items-center">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white truncate">
              <Icon
                icon="mdi:folder-star"
                className="inline mr-2 text-primary_one"
              />
              {project.projectName}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary_one/10 text-primary_one rounded-full text-sm flex items-center gap-1">
                <Icon icon="mdi:label" className="text-sm" />
                {project.category}
              </span>
              <span className="px-3 py-1 bg-primary_one/10 text-primary_one rounded-full text-sm flex items-center gap-1">
                <Icon icon="mdi:priority-high" className="text-sm" />
                {project.priority}
              </span>

              <span
                className={`px-3 py-1 bg-primary_one/10 rounded-full text-sm flex items-center gap-1 ${
                  project?.status === "in-progress"
                    ? "text-red-400"
                    : project?.status === "completed"
                    ? "text-green-400"
                    : "text-primary_one"
                }`}
              >
                <Icon icon="mdi:progress-check" className="text-sm" />
                {project.status}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
        </div>

        {/* Links Section */}
        <div className="mt-4 mb-6 flex flex-col gap-2">
          {project.githubClient && (
            <a
              href={project.githubClient}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary_one hover:text-primary_one/80 transition-colors"
            >
              <Icon icon="mdi:github" className="text-xl" />
              <span className="truncate">Client Repository</span>
              <Icon icon="mdi:open-in-new" className="ml-1 text-sm" />
            </a>
          )}

          {project.githubServer && (
            <a
              href={project.githubServer}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary_one hover:text-primary_one/80 transition-colors"
            >
              <Icon icon="mdi:github" className="text-xl" />
              <span className="truncate">Server Repository</span>
              <Icon icon="mdi:open-in-new" className="ml-1 text-sm" />
            </a>
          )}

          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary_one hover:text-primary_one/80 transition-colors"
            >
              <Icon icon="mdi:web" className="text-xl" />
              <span className="truncate">Live Demo</span>
              <Icon icon="mdi:open-in-new" className="ml-1 text-sm" />
            </a>
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between gap-1">
            <button
              onClick={() => onEdit(project)}
              className="p-2 hover:bg-primary_one/10 rounded-full transition-colors"
            >
              <Icon icon="mdi:pencil" className="text-xl text-primary_one" />
            </button>
            <button
              onClick={() => onDelete(project._id as string)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <Icon
                icon="mdi:trash-can-outline"
                className="text-xl text-red-200 hover:text-red-600"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
