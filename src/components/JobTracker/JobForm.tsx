import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { JobApplication } from "../../types/JobsTypes";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

interface JobFormProps {
  onSubmit: (data: JobApplication) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<JobApplication>;
  isEditing?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobApplication>({
    defaultValues: defaultValues as JobApplication,
  });

  useEffect(() => {
    if (defaultValues) {
      const updatedDefaults = defaultValues.appliedDate
        ? {
            ...defaultValues,
            appliedDate: new Date(defaultValues.appliedDate)
              .toISOString()
              .split("T")[0],
          }
        : defaultValues;
      reset(updatedDefaults as JobApplication);
    }
  }, [defaultValues, reset]);

  const submitHandler: SubmitHandler<JobApplication> = async (data) => {
    try {
      const payload = {
        ...data,
        appliedDate: new Date(data.appliedDate).toISOString(),
      };
      await onSubmit(payload);
    } catch (error) {
      console.log(error);
      toast.error("Failed to save application. Please try again.");
    }
  };

  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold dark:text-primary_one">
            <Icon icon="mdi:briefcase-edit" className="inline mr-2" />
            {isEditing ? "Edit Application" : "New Application"}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <Icon icon="mdi:close" className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-200">
                Company *
              </label>
              <input
                {...register("company", { required: true })}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary_one focus:border-transparent"
              />
              {errors.company && (
                <span className="text-red-500 text-sm">Required field</span>
              )}
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-200">
                Position *
              </label>
              <input
                {...register("position", { required: true })}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary_one focus:border-transparent"
              />
              {errors.position && (
                <span className="text-red-500 text-sm">Required field</span>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-200">
              Skills (comma separated)
            </label>
            <input
              {...register("skills")}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary_one focus:border-transparent"
              placeholder="e.g., React, TypeScript, Node.js"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-200">
                Location *
              </label>
              <input
                {...register("location", { required: true })}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary_one focus:border-transparent"
              />
              {errors.location && (
                <span className="text-red-500 text-sm">Required field</span>
              )}
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-200">
                Employment Type *
              </label>
              <select
                {...register("type", { required: true })}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary_one focus:border-transparent"
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-200">
                Source *
              </label>
              <select
                {...register("source", { required: true })}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary_one focus:border-transparent"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Company Website">Company Website</option>
                <option value="Indeed">Indeed</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Interest Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-200">
                Interest Level *
              </label>
              <select
                {...register("interest", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary_one focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Salary */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-200">
                Salary Range
              </label>
              <input
                {...register("salary")}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary_one focus:border-transparent"
                placeholder="e.g., $80,000 - $100,000"
              />
            </div>

            {/* Applied Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-200">
                Applied Date *
              </label>
              <input
                type="date"
                {...register("appliedDate", { required: true })}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary_one focus:border-transparent"
              />
              {errors.appliedDate && (
                <span className="text-red-500 text-sm">Required field</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-200">
                Status *
              </label>
              <select
                {...register("status", { required: true })}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary_one focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="no_response">No Response</option>
                <option value="offer">Offer</option>
              </select>
            </div>

            {/* Easy Apply */}
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                {...register("easyApply")}
                className="w-4 h-4 rounded border-gray-300 text-primary_one focus:ring-primary_one dark:bg-gray-700 dark:border-gray-600"
                id="easyApply"
              />
              <label
                htmlFor="easyApply"
                className="text-sm font-medium dark:text-gray-200"
              >
                Easy Apply
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary_one text-white rounded-lg hover:bg-primary_one transition-colors flex items-center gap-2"
            >
              <Icon icon="mdi:check" className="text-lg" />
              {isEditing ? "Update Application" : "Create Application"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JobForm;
