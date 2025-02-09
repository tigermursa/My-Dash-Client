import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { motion } from "framer-motion";
import { JobApplication } from "../../types/JobsTypes";

interface JobFormProps {
  onSubmit: (data: JobApplication) => Promise<void> | void;
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

  // Update the form values when defaultValues change (important for editing)
  useEffect(() => {
    if (defaultValues) {
      // If appliedDate exists, convert it to YYYY-MM-DD format for the date input
      const updatedDefaults = defaultValues.appliedDate
        ? {
            ...defaultValues,
            appliedDate: new Date(defaultValues.appliedDate)
              .toISOString()
              .split("T")[0],
          }
        : defaultValues;
      reset(updatedDefaults as JobApplication);
    } else {
      reset();
    }
  }, [defaultValues, reset]);

  const submitHandler: SubmitHandler<JobApplication> = async (data) => {
    // Convert appliedDate to an ISO string before sending
    const payload = {
      ...data,
      appliedDate: new Date(data.appliedDate).toISOString(),
    };
    await onSubmit(payload);
  };

  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-6 dark:text-primary_one">
          {isEditing ? "Edit Application" : "Add Application"}
        </h3>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Company *
            </label>
            <input
              {...register("company", { required: true })}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.company && (
              <span className="text-red-500 text-sm">Required</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Position *
            </label>
            <input
              {...register("position", { required: true })}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.position && (
              <span className="text-red-500 text-sm">Required</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Skills (comma separated)
            </label>
            <input
              {...register("skills")}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Location *
            </label>
            <input
              {...register("location", { required: true })}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.location && (
              <span className="text-red-500 text-sm">Required</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Employment Type *
            </label>
            <select
              {...register("type", { required: true })}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Source *
            </label>
            <select
              {...register("source", { required: true })}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Company Website">Company Website</option>
              <option value="Indeed">Indeed</option>
              <option value="Referral">Referral</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Interest Level *
            </label>
            <select
              {...register("interest", { required: true, valueAsNumber: true })}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value} Star{value > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Status *
            </label>
            <select
              {...register("status", { required: true })}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
              <option value="no_response">No Response</option>
              <option value="offer">Offer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Salary
            </label>
            <input
              {...register("salary")}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., $80,000 - $100,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Applied Date *
            </label>
            <input
              type="date"
              {...register("appliedDate", { required: true })}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.appliedDate && (
              <span className="text-red-500 text-sm">Required</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("easyApply")}
              className="w-4 h-4 rounded border-gray-300 text-primary_one focus:ring-primary_one"
              id="easyApply"
            />
            <label
              htmlFor="easyApply"
              className="text-sm font-medium dark:text-gray-300"
            >
              Easy Apply
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary_one text-white rounded-lg hover:bg-primary_one"
            >
              {isEditing ? "Update Application" : "Add Application"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JobForm;
