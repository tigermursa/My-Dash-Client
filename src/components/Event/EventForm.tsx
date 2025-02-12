import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { DateEvent } from "../../types/EventTypes";

interface DateEventFormProps {
  isOpen: boolean;
  initialValues: DateEvent;
  onSubmit: (data: DateEvent) => void;
  onClose: () => void;
}

const EventForm: React.FC<DateEventFormProps> = ({
  initialValues,
  onSubmit,
  onClose,
}) => {
  const { control, handleSubmit, reset } = useForm<DateEvent>({
    defaultValues: initialValues,
  });

  // Reset the form whenever the initial values change.
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 rounded-xl bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialValues._id ? "Update Event" : "Add New Event"}
            </h2>
            <button
              type="button"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={onClose}
            >
              <Icon icon="mdi:close" className="text-2xl" />
            </button>
          </div>

          {/* Event Name */}
          <div className="relative mb-4">
            <Icon
              icon="mdi:calendar-text"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
            <Controller
              name="eventName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Event Name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary_one"
                />
              )}
            />
          </div>

          {/* Event Date */}
          <div className="relative mb-4">
            <Icon
              icon="mdi:calendar"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
            <Controller
              name="eventDate"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary_one"
                />
              )}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="px-6 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={onClose}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-2 bg-primary_one text-white rounded-lg hover:bg-primary_one/90 transition-colors"
            >
              {initialValues._id ? "Update" : "Add Date"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EventForm;
