import React, { useCallback } from "react";
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
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }, []);

  const calculateDuration = useCallback(
    (start: string, end: string, isCurrent: boolean) => {
      const startDate = new Date(start);
      const endDate = isCurrent ? new Date() : new Date(end);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());

      const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
      );
      const days = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
      );

      const duration = [];
      if (years > 0) duration.push(`${years}year`);
      if (months > 0) duration.push(`${months} month`);
      if (days > 0 && years === 0) duration.push(`${days} day`);

      return duration.join(" ") || "0d";
    },
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-primary_one/20 dark:border-primary_one/30 hover:border-primary_one/40 transition-all"
    >
      <div className="flex justify-between items-start gap-4">
        {/* Left Section */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Icon
              icon="mdi:office-building"
              className="text-2xl text-primary_one"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {experience.companyName}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {experience.position}
              </p>
            </div>
          </div>

          {/* Duration Highlight */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary_one/10 rounded-full">
            <Icon
              icon="mdi:clock-outline"
              className="text-primary_one text-lg"
            />
            <span className="text-primary_one font-semibold">
              {calculateDuration(
                experience.startDate,
                experience.endDate,
                experience.isCurrent
              )}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-end gap-4">
          {/* Date Display */}
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icon icon="mdi:calendar-start" className="flex-shrink-0" />
              <span className="font-medium">
                {formatDate(experience.startDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icon icon="mdi:calendar-end" className="flex-shrink-0" />
              <span className="font-medium">
                {experience.isCurrent
                  ? "Present"
                  : formatDate(experience.endDate)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(experience)}
              className="p-2 hover:bg-primary_one/10 rounded-full transition-colors"
            >
              <Icon
                icon="mdi:pencil"
                className="text-xl text-gray-500 hover:text-primary_one"
              />
            </button>
            <button
              onClick={() => experience._id && onDelete(experience._id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <Icon
                icon="mdi:trash-can-outline"
                className="text-xl text-gray-500 hover:text-red-500"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ExperienceCard);
