import React from "react";
import {
  Controller,
  UseFormHandleSubmit,
  Control,
  UseFormWatch,
} from "react-hook-form";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Experience } from "../../types/ExperienceType";

export interface ExperienceFormProps {
  control: Control<Experience>;
  handleSubmit: UseFormHandleSubmit<Experience>;
  onSubmit: (data: Experience) => void;
  onCancel: () => void;
  isCurrent: boolean;
  watch: UseFormWatch<Experience>;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  control,
  handleSubmit,
  onSubmit,
  onCancel,
  isCurrent,
  watch,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Company Name */}
      <div className="relative">
        <Icon
          icon="mdi:office-building"
          className="absolute left-3 top-4 text-gray-400 dark:text-primary_one"
        />
        <Controller
          name="companyName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Company Name"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:text-gray-100 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        />
      </div>

      {/* Position */}
      <div className="relative">
        <Icon
          icon="mdi:briefcase"
          className="absolute left-3 top-4 text-gray-400 dark:text-primary_one"
        />
        <Controller
          name="position"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Position"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:text-gray-100 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        />
      </div>

      {/* Date Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Icon
            icon="mdi:calendar-start"
            className="absolute left-3 top-4 text-gray-400 dark:text-primary_one"
          />
          <Controller
            name="startDate"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          />
        </div>
        <div className="relative">
          <Icon
            icon="mdi:calendar-end"
            className="absolute left-3 top-4 text-gray-400 dark:text-primary_one"
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                disabled={isCurrent}
                min={watch("startDate")}
              />
            )}
          />
        </div>
      </div>

      {/* Current Job Checkbox */}
      <div className="flex items-center gap-2">
        <Controller
          name="isCurrent"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          )}
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          I currently work here
        </span>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Experience
        </motion.button>
      </div>
    </form>
  );
};

export default ExperienceForm;
