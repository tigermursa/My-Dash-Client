// Experience.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import ExperienceCard from "../components/Experience/ExperienceCard";

import {
  useGetAllExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from "../lib/experienceApi";
import useAuth from "../hooks/useAuth";
import ExperienceForm from "../components/Experience/ExperienceForm";
import type { Experience } from "../types/ExperienceType";

// Optional: if your API returns an object with an experiences array,
// you can type it here. Otherwise, if data is simply Experience[], adjust accordingly.
interface ApiResponse {
  experiences: Experience[];
}

const Experience: React.FC = () => {
  const { user } = useAuth();
  const userId = user?._id as string;

  // Setup react-hook-form with default values.
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

  // Fetch experiences via React Query.
  const { data, isLoading, isError, refetch } = useGetAllExperiences(userId);
  const experiences: Experience[] =
    (data as unknown as ApiResponse)?.experiences || [];

  // API mutations
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();
  const deleteMutation = useDeleteExperience();

  // Local state for selected experience (for editing) and modal visibility.
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [showModal, setShowModal] = useState(false);

  const isCurrent = watch("isCurrent");

  // Opens the modal and pre-fills the form if editing.
  const openModal = (experience?: Experience) => {
    if (experience) {
      setSelectedExperience(experience);
      reset(experience);
    } else {
      setSelectedExperience(null);
      reset({
        userId,
        companyName: "",
        position: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
      });
    }
    setShowModal(true);
  };

  // Handles form submission for create/update.
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

  // Handles deletion of an experience.
  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync({ id, userId });
    refetch();
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
            <ExperienceCard
              key={exp._id}
              experience={exp}
              onEdit={openModal}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Modal for Experience Form */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
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
                <ExperienceForm
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  onCancel={() => setShowModal(false)}
                  isCurrent={isCurrent}
                  watch={watch}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Experience;
