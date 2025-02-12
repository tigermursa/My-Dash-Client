import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { SkillFormData } from "../../types/SkillTypes";

// Define the form data type for creating/updating a skill.

interface SkillFormProps {
  isOpen: boolean;
  initialValues: SkillFormData;
  onSubmit: (data: SkillFormData) => void;
  onClose: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({
  initialValues,
  onSubmit,
  onClose,
}) => {
  const { control, handleSubmit, reset } = useForm<SkillFormData>({
    defaultValues: initialValues,
  });

  // Reset the form values when the initialValues change (e.g. switching between add and edit)
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            {initialValues._id ? "Edit Skill" : "Add New Skill"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-primary_one transition-colors"
          >
            <Icon icon="mdi:close" className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Skill Name Field */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium dark:text-gray-300">
              <Icon icon="mdi:tag" className="text-primary_one" />
              Skill Name
            </label>
            <Controller
              name="skillName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Enter skill name"
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white focus:border-primary_one focus:ring-2 focus:ring-primary_one"
                  required
                />
              )}
            />
          </div>

          {/* Category Field */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium dark:text-gray-300">
              <Icon icon="mdi:shape" className="text-primary_one" />
              Category
            </label>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white focus:border-primary_one focus:ring-2 focus:ring-primary_one"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="tool">Tool</option>
                  <option value="plan-to-learn">Plan to Learn</option>
                </select>
              )}
            />
          </div>

          {/* Proficiency Level Field */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium dark:text-gray-300">
              <Icon icon="mdi:star" className="text-primary_one" />
              Proficiency Level
            </label>
            <Controller
              name="level"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white focus:border-primary_one focus:ring-2 focus:ring-primary_one"
                >
                  <option value="beginner">Beginner</option>
                  <option value="medium">Medium</option>
                  <option value="advanced">Advanced</option>
                </select>
              )}
            />
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-primary_one to-primary_one text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Icon icon="mdi:check" className="text-xl" />
              {initialValues._id ? "Update Skill" : "Add Skill"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SkillForm;
