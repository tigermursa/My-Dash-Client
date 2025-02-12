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
  // Return an icon name based on the skill name.
  const getSkillIcon = (skillName: string) => {
    const icons: Record<string, string> = {
      react: "mdi:react",
      "node.js": "mdi:nodejs",
      typescript: "mdi:language-typescript",
      python: "mdi:language-python",
      graphql: "mdi:graphql",
      aws: "mdi:aws",
      docker: "mdi:docker",
    };
    return icons[skillName.toLowerCase()] || "mdi:code-brackets";
  };

  // Return star icons based on the proficiency level.
  const getLevelStars = (level: string) => {
    const starsCount = { beginner: 1, medium: 2, advanced: 3 }[level] ?? 1;
    return Array.from({ length: 3 }).map((_, i) => (
      <Icon
        key={i}
        icon={i < starsCount ? "mdi:star" : "mdi:star-outline"}
        className={`text-lg ${
          i < starsCount ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg group hover:bg-gradient-to-r from-primary_one/5 to-primary_one/5 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Icon
            icon={getSkillIcon(skill.skillName)}
            className="text-2xl text-primary_one"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold dark:text-gray-200">
            {skill.skillName}
          </h3>
          {skill.category !== "plan-to-learn" && (
            <div className="flex items-center gap-1 mt-1">
              {getLevelStars(skill.level)}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-primary_one transition-colors"
          >
            <Icon icon="mdi:pencil" className="text-lg" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Icon icon="mdi:delete" className="text-lg" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillCard;
