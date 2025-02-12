import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  useGetAllExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from "../lib/experienceApi";
import useAuth from "../hooks/useAuth";

interface Experience {
  _id?: string;
  userId: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

const Experience = () => {
  const { user } = useAuth();
  const userId = user?._id as string;
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm<Experience>({
    defaultValues: {
      userId,
      companyName: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    },
  });

  // Fetch experiences
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetAllExperiences(userId);
  const experiences = response?.experiences || [];

  // API mutations
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();
  const deleteMutation = useDeleteExperience();

  const isCurrent = watch("isCurrent");

  const openModal = (experience?: Experience) => {
    if (experience) {
      setSelectedExperience(experience);
      reset(experience); // Pre-fill form for update
    } else {
      reset({
        userId,
        companyName: "",
        position: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
      });
      setSelectedExperience(null); // Clear selected experience for create
    }
    setShowModal(true);
  };

  const onSubmit = async (data: Experience) => {
    try {
      if (selectedExperience) {
        await updateMutation.mutateAsync({ id: selectedExperience._id!, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setShowModal(false);
      refetch();
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  const deleteExperience = async (id: string) => {
    await deleteMutation.mutateAsync({ id, userId });
    refetch();
  };

  const calculateDuration = (
    start: string,
    end: string,
    isCurrent: boolean
  ) => {
    const startDate = new Date(start);
    const endDate = isCurrent ? new Date() : new Date(end);
    const diff =
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear());

    const years = Math.floor(diff / 12);
    const months = diff % 12;

    return `${years > 0 ? `${years}y ` : ""}${months}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading)
    return <div className="text-center p-8 dark:text-white">Loading...</div>;
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">
        Error loading experiences
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Work Experience
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => openModal()}
          >
            <Icon icon="mdi:plus" className="text-xl" />
            Add Experience
          </motion.button>
        </div>

        {/* Experience List */}
        <div className="space-y-6">
          {experiences.map((exp) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {exp.position}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                    <Icon icon="mdi:office-building" className="text-lg" />
                    <span>{exp.companyName}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:calendar-start" />
                      <span>{formatDate(exp.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:calendar-end" />
                      <span>
                        {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:clock-outline" />
                      <span>
                        {calculateDuration(
                          exp.startDate,
                          exp.endDate,
                          exp.isCurrent
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(exp)}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full"
                  >
                    <Icon icon="mdi:pencil" className="text-xl" />
                  </button>
                  <button
                    onClick={() => deleteExperience(exp._id!)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-full"
                  >
                    <Icon icon="mdi:trash-can-outline" className="text-xl" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Experience Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {selectedExperience ? "Edit Experience" : "Add Experience"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <Icon icon="mdi:close" className="text-2xl" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Company Name */}
                  <div className="relative">
                    <Icon
                      icon="mdi:office-building"
                      className="absolute left-3 top-4 text-gray-400 dark:text-gray-500"
                    />
                    <Controller
                      name="companyName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder="Company Name"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    />
                  </div>

                  {/* Position */}
                  <div className="relative">
                    <Icon
                      icon="mdi:briefcase"
                      className="absolute left-3 top-4 text-gray-400 dark:text-gray-500"
                    />
                    <Controller
                      name="position"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder="Position"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    />
                  </div>

                  {/* Date Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Icon
                        icon="mdi:calendar-start"
                        className="absolute left-3 top-4 text-gray-400 dark:text-gray-500"
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
                        className="absolute left-3 top-4 text-gray-400 dark:text-gray-500"
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
                      onClick={() => setShowModal(false)}
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
                      {selectedExperience ? "Update" : "Save"} Experience
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Experience;
