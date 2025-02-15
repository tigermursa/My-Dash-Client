import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { fadeIn, staggerContainer } from "../utils/motions";
import {
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../lib/skillApi";
import useAuth from "../hooks/useAuth";
import { Skill, SkillFormData } from "../types/SkillTypes";

import SkillForm from "../components/Skills/SkillsForm";
import SkillCard from "../components/Skills/SkillsCard";

const Skills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch skills when user ID is available
  useEffect(() => {
    const loadSkills = async () => {
      try {
        if (user?._id) {
          const skillsData = await fetchSkills(user._id);
          setSkills(skillsData);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load skills");
      } finally {
        setLoading(false);
      }
    };
    loadSkills();
  }, [user?._id]);

  // Create new skill
  const handleCreateSkill = async (
    skillData: Omit<Skill, "_id" | "userID">
  ) => {
    try {
      if (!user?._id) return;
      const newSkill = await createSkill({ ...skillData, userID: user._id });
      setSkills((prev) => [...prev, newSkill as Skill]);
      toast.success("Skill created successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create skill");
    }
  };

  // Update existing skill
  const handleUpdateSkill = async (skillData: Omit<Skill, "userID">) => {
    try {
      const updatedSkill: Skill = await updateSkill(skillData._id, {
        ...skillData,
        userID: user!._id,
      });
      setSkills((prev) =>
        prev.map((skill) =>
          skill._id === updatedSkill._id ? updatedSkill : skill
        )
      );
      toast.success("Skill updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update skill");
    }
  };

  // Delete a skill
  const handleDeleteSkill = async (skillId: string) => {
    try {
      if (!user?._id) return;
      await deleteSkill(user._id, skillId);
      setSkills((prev) => prev.filter((skill) => skill._id !== skillId));
      toast.success("Skill deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete skill");
    }
  };

  // Handle form submission for both create and update actions
  const handleFormSubmit = (data: SkillFormData) => {
    if (editingSkill) {
      handleUpdateSkill({ ...data, _id: editingSkill._id });
    } else {
      handleCreateSkill(data);
    }
  };

  // Default form values for adding a new skill
  const defaultFormValues: SkillFormData = {
    skillName: "",
    category: "frontend",
    level: "medium",
  };

  // Determine initial form values for editing or creating
  const formInitialValues: SkillFormData = editingSkill
    ? {
        _id: editingSkill._id,
        skillName: editingSkill.skillName,
        category: editingSkill.category as SkillFormData["category"],
        level: editingSkill.level as SkillFormData["level"],
      }
    : defaultFormValues;

  // Show a loading spinner until skills are loaded
  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center">
        <Icon
          icon="mdi:loading"
          className="animate-spin text-4xl text-primary_one"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.1, 0.2)}
      className="p-6 dark:bg-gray-900 h-full mt-16 md:mt-10 lg:mt-0"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            variants={fadeIn("down", 0.2)}
            className="text-3xl font-bold bg-gradient-to-r from-primary_one to-primary_one bg-clip-text text-transparent"
          >
            <Icon icon="mdi:brain" className="inline mr-2 text-primary_one" />
            Technical Expertise
          </motion.h1>
          <motion.button
            variants={fadeIn("left", 0.4)}
            onClick={() => {
              setEditingSkill(null);
              setIsModalOpen(true);
            }}
            className="bg-primary_one hover:bg-primary_one text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 group"
          >
            <Icon
              icon="mdi:plus"
              className="text-xl group-hover:rotate-90 transition-transform"
            />
            Add Skill
          </motion.button>
        </div>

        {/* Skills Table */}
        <motion.div
          variants={fadeIn("up", 0.4)}
          className="border rounded-lg overflow-hidden dark:border-gray-700"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="col-span-4 text-xs font-medium text-gray-500">
              Name
            </div>
            <div className="col-span-4 text-xs font-medium text-gray-500">
              Category
            </div>
            <div className="col-span-2 text-xs font-medium text-gray-500">
              Level
            </div>
            <div className="col-span-2 text-xs text-end font-medium text-gray-500">
              Action
            </div>
          </div>

          {/* Skills List */}
          <AnimatePresence>
            {skills.map((skill) => (
              <SkillCard
                key={skill._id}
                skill={skill}
                onEdit={() => {
                  setEditingSkill(skill);
                  setIsModalOpen(true);
                }}
                onDelete={() => handleDeleteSkill(skill._id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal Form */}
        <AnimatePresence>
          {isModalOpen && (
            <SkillForm
              isOpen={isModalOpen}
              initialValues={formInitialValues}
              onSubmit={handleFormSubmit}
              onClose={() => {
                setIsModalOpen(false);
                setEditingSkill(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Skills;
