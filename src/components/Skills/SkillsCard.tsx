import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Skill } from "../../types/SkillTypes";

interface SkillCardProps {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-12 items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      {/* Name */}
      <div className="col-span-4">
        <span className="font-medium dark:text-gray-200 truncate">
          {skill.skillName}
        </span>
      </div>
      {/* Category */}
      <div className="col-span-4">
        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {skill.category}
        </span>
      </div>
      {/* Level */}
      <div className="col-span-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {skill.level}
        </span>
      </div>
      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-3">
        <button
          onClick={onEdit}
          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Icon icon="ph:pencil-simple-line" className="text-lg" />
        </button>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Icon icon="ph:trash-simple" className="text-lg" />
        </button>
      </div>
    </motion.div>
  );
};

export default SkillCard;
