// JobInfoCard.tsx
import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import {
  JobApplication,
  ApplicationStatus,
  InterestLevel,
} from "../../types/JobsTypes";
import { fadeIn } from "../../utils/motions";

interface JobInfoCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (jobId: string) => void;
}

const JobInfoCard: React.FC<JobInfoCardProps> = ({ job, onEdit, onDelete }) => {
  // Render stars based on the interest level
  const renderInterestStars = (level: InterestLevel) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Icon
        key={i}
        icon={i < level ? "mdi:star" : "mdi:star-outline"}
        className={`text-lg ${i < level ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));

  // Choose a color based on the application status
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "interview":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "offer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "no_response":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      variants={fadeIn("up", 0.2)}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-primary_one/20 relative"
    >
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => onEdit(job)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <Icon
            icon="mdi:pencil"
            className="text-gray-600 dark:text-gray-300"
          />
        </button>
        <button
          onClick={() => onDelete(job._id!)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <Icon icon="mdi:trash" className="text-red-500" />
        </button>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold dark:text-primary_one">
            {job.company}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{job.position}</p>
          <span
            className={`inline-block mt-2 text-sm px-3 py-1 rounded-full ${getStatusColor(
              job.status
            )}`}
          >
            {job.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:map-marker" className="text-gray-500" />
          <span className="dark:text-gray-300">{job.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Icon icon="mdi:source-branch" className="text-gray-500" />
          <span className="dark:text-gray-300">{job.source}</span>
        </div>

        <div className="flex items-center gap-2">
          <Icon icon="mdi:clock" className="text-gray-500" />
          <span className="dark:text-gray-300">
            Applied: {new Date(job.appliedDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Icon icon="mdi:heart" className="text-gray-500" />
          <div className="flex">{renderInterestStars(job.interest)}</div>
        </div>

        {job.salary && (
          <div className="flex items-center gap-2">
            <Icon icon="mdi:cash" className="text-gray-500" />
            <span className="dark:text-gray-300">{job.salary}</span>
          </div>
        )}
      </div>

      <span className="absolute bottom-2 right-2 px-3 py-1 bg-primary_one/10 text-primary_one dark:bg-primary_one/20 dark:text-primary_one rounded-full text-sm">
        {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
      </span>
    </motion.div>
  );
};

export default JobInfoCard;
