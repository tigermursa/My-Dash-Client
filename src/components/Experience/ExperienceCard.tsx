import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Experience } from "../../types/ExperienceType";

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  onEdit,
  onDelete,
}) => {
  // Format a date string to a short month/year format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Calculate
  const calculateDuration = (
    start: string,
    end: string,
    isCurrent: boolean
  ) => {
    const startDate = new Date(start);
    const endDate = isCurrent ? new Date() : new Date(end);
    const diff =
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear());
    const years = Math.floor(diff / 12);
    const months = diff % 12;
    return `${years > 0 ? `${years}y ` : ""}${months}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {experience.position}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
            <Icon icon="mdi:office-building" className="text-lg" />
            <span>{experience.companyName}</span>
          </div>
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:calendar-start" />
              <span>{formatDate(experience.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:calendar-end" />
              <span>
                {experience.isCurrent
                  ? "Present"
                  : formatDate(experience.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:clock-outline" />
              <span>
                {calculateDuration(
                  experience.startDate,
                  experience.endDate,
                  experience.isCurrent
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(experience)}
            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full"
          >
            <Icon icon="mdi:pencil" className="text-xl" />
          </button>
          <button
            onClick={() => experience._id && onDelete(experience._id)}
            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-full"
          >
            <Icon icon="mdi:trash-can-outline" className="text-xl" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;
