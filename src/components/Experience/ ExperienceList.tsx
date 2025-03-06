import React, { useMemo } from "react";
import ExperienceCard from "./ExperienceCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Experience } from "../../types/ExperienceType";

interface ExperienceListProps {
  experiences: Experience[];
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences,
  onEdit,
  onDelete,
}) => {
  const calculateTotalExperience = useMemo(() => {
    let totalMonths = 0;

    experiences.forEach((exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate);
      const diff =
        endDate.getMonth() -
        startDate.getMonth() +
        12 * (endDate.getFullYear() - startDate.getFullYear());
      totalMonths += diff;
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const duration = [];
    if (years > 0) duration.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) duration.push(`${months} month${months > 1 ? "s" : ""}`);

    return duration.join(" ") || "0 months";
  }, [experiences]);

  return (
    <div className="space-y-6">
      {/* Total Experience Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Work Experience
        </h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary_one/10 rounded-full">
          <Icon icon="mdi:clock-outline" className="text-primary_one text-lg" />
          <span className="text-primary_one font-semibold">
            {calculateTotalExperience}
          </span>
        </div>
      </div>

      {/* Experience Cards */}
      {experiences.map((exp) => (
        <ExperienceCard
          key={exp._id}
          experience={exp}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ExperienceList;
