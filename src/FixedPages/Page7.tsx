import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/motions";
import { toast } from "react-toastify";

import {
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../lib/skillApi";
import useAuth from "../hooks/useAuth";
import { Skill } from "../types/SkillTypes";

const Skills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch skills from API
  useEffect(() => {
    const loadSkills = async () => {
      try {
        if (user?._id) {
          const skillsData = await fetchSkills(user._id);
          setSkills(skillsData);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load skills");
      } finally {
        setLoading(false);
      }
    };
    loadSkills();
  }, [user?._id]);

  const handleCreateSkill = async (
    skillData: Omit<Skill, "_id" | "userID">
  ) => {
    try {
      if (!user?._id) return;

      const newSkill = await createSkill({
        ...skillData,
        userID: user._id,
      });
      setSkills((prev) => [...prev, newSkill as Skill]);
      toast.success("Skill created successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create skill");
    }
  };

  const handleUpdateSkill = async (skillData: Omit<Skill, "userID">) => {
    try {
      const updatedSkill: Skill = await updateSkill(skillData._id, {
        ...skillData,
        userID: user!._id,
      });

      setSkills((prev: Skill[]) =>
        prev.map((skill) =>
          skill._id === updatedSkill._id ? updatedSkill : skill
        )
      );

      toast.success("Skill updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update skill");
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      if (!user?._id) return;

      await deleteSkill(user._id, skillId);
      setSkills((prev) => prev.filter((skill) => skill._id !== skillId));
      toast.success("Skill deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete skill");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "frontend":
        return "mdi:monitor";
      case "backend":
        return "mdi:server";
      case "tool":
        return "mdi:tools";
      case "plan-to-learn":
        return "mdi:book-arrow-right";
      default:
        return "mdi:code-braces";
    }
  };

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

  const getLevelStars = (level: string) => {
    const stars =
      {
        beginner: 1,
        medium: 2,
        advanced: 3,
      }[level] ?? 1;

    return Array.from({ length: 3 }).map((_, i) => (
      <Icon
        key={i}
        icon={i < stars ? "mdi:star" : "mdi:star-outline"}
        className={`text-lg ${i < stars ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-primarydarkbg flex items-center justify-center">
        <Icon
          icon="mdi:loading"
          className="animate-spin text-4xl text-darker_green"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.1, 0.2)}
      className="p-6 dark:bg-primarydarkbg min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            variants={fadeIn("down", 0.2)}
            className="text-3xl font-bold bg-gradient-to-r from-dark_green to-light_green bg-clip-text text-transparent"
          >
            <Icon icon="mdi:brain" className="inline mr-2 text-darker_green" />
            Technical Expertise
          </motion.h1>
          <motion.button
            variants={fadeIn("left", 0.4)}
            onClick={() => {
              setEditingSkill(null);
              setIsModalOpen(true);
            }}
            className="bg-darker_green hover:bg-dark_green text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 group"
          >
            <Icon
              icon="mdi:plus"
              className="text-xl group-hover:rotate-90 transition-transform"
            />
            Add Skill
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["frontend", "backend", "tool", "plan-to-learn"].map((category) => (
            <motion.div
              key={category}
              variants={fadeIn("up", 0.4)}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-darker_green/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-darker_green/10 rounded-lg">
                  <Icon
                    icon={getCategoryIcon(category)}
                    className="text-3xl text-darker_green"
                  />
                </div>
                <h2 className="text-xl font-semibold dark:text-light_green">
                  {category === "plan-to-learn"
                    ? "Plan to Learn"
                    : `${category} Stack`}
                </h2>
              </div>

              <div className="grid gap-4">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <motion.div
                      key={skill._id}
                      variants={fadeIn("up", 0.2)}
                      className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg group hover:bg-gradient-to-r from-darker_green/5 to-dark_green/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                          <Icon
                            icon={getSkillIcon(skill.skillName)}
                            className="text-2xl text-darker_green"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold dark:text-gray-200">
                            {skill.skillName}
                          </h3>
                          {category !== "plan-to-learn" && (
                            <div className="flex items-center gap-1 mt-1">
                              {getLevelStars(skill.level)}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingSkill(skill);
                              setIsModalOpen(true);
                            }}
                            className="text-gray-400 hover:text-darker_green transition-colors"
                          >
                            <Icon icon="mdi:pencil" className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Icon icon="mdi:delete" className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold dark:text-white">
                    {editingSkill ? "Edit Skill" : "Add New Skill"}
                  </h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingSkill(null);
                    }}
                    className="text-gray-500 hover:text-darker_green transition-colors"
                  >
                    <Icon icon="mdi:close" className="text-2xl" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const skillData = {
                      skillName: formData.get("skillName") as string,
                      category: formData.get("category") as Skill["category"],
                      level: formData.get("level") as Skill["level"],
                    };

                    if (editingSkill) {
                      handleUpdateSkill({
                        ...skillData,
                        _id: editingSkill._id,
                      });
                    } else {
                      handleCreateSkill(skillData);
                    }
                  }}
                >
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-sm font-medium dark:text-gray-300">
                        <Icon icon="mdi:tag" className="text-darker_green" />
                        Skill Name
                      </label>
                      <input
                        name="skillName"
                        type="text"
                        required
                        defaultValue={editingSkill?.skillName}
                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white focus:border-darker_green focus:ring-2 focus:ring-dark_green"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-sm font-medium dark:text-gray-300">
                        <Icon icon="mdi:shape" className="text-darker_green" />
                        Category
                      </label>
                      <select
                        name="category"
                        defaultValue={editingSkill?.category || "frontend"}
                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white focus:border-darker_green focus:ring-2 focus:ring-dark_green"
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="tool">Tool</option>
                        <option value="plan-to-learn">Plan to Learn</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-sm font-medium dark:text-gray-300">
                        <Icon icon="mdi:star" className="text-darker_green" />
                        Proficiency Level
                      </label>
                      <select
                        name="level"
                        defaultValue={editingSkill?.level || "medium"}
                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white focus:border-darker_green focus:ring-2 focus:ring-dark_green"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="medium">Medium</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-darker_green to-dark_green text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Icon icon="mdi:check" className="text-xl" />
                        {editingSkill ? "Update Skill" : "Add Skill"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Skills;
