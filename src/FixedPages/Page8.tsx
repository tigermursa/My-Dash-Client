import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { JobApplication } from "../types/JobsTypes";
import { fetchJobs, createJob, updateJob, deleteJob } from "../lib/jobsApi";
import useAuth from "../hooks/useAuth";
import { fadeIn, staggerContainer } from "../utils/motions";
import JobInfoCard from "../components/JobTracker/JobInfoCard";
import JobForm from "../components/JobTracker/JobForm";
import { toast } from "react-toastify";
import Loader from "../components/Ui/Loader/Loader";

const JobTracker: React.FC = () => {
  const { user } = useAuth();
  const userId = user?._id as string;

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const jobs = await fetchJobs(userId);
      setApplications(jobs);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleFormSubmit = async (data: JobApplication) => {
    try {
      const payload = { ...data, userId };

      if (editingJob) {
        await updateJob(editingJob._id!, payload);
        toast.success("Application updated successfully!");
      } else {
        await createJob(payload);
        toast.success("Application created successfully!");
      }

      await loadApplications();
      setIsModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save application. Please try again.");
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await deleteJob(userId, jobId);
      await loadApplications();
      toast.success("Application deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete application. Please try again.");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.1, 0.2)}
      className="p-6 dark:bg-gray-900 h-full mt-20 md:mt-10 lg:mt-0"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            variants={fadeIn("down", 0.2)}
            className="text-3xl font-bold bg-gradient-to-r from-primary_one to-primary_one bg-clip-text text-transparent hidden md:block"
          >
            <Icon
              icon="mdi:briefcase"
              className="inline mr-2 text-primary_one"
            />
            Job Applications
          </motion.h1>
          <motion.button
            variants={fadeIn("left", 0.4)}
            onClick={() => setIsModalOpen(true)}
            className="bg-primary_one hover:bg-primary_one text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 group"
          >
            <Icon
              icon="mdi:plus"
              className="text-xl group-hover:rotate-90 transition-transform"
            />
            Add Application
          </motion.button>
        </div>

        {loading && <Loader />}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <JobInfoCard
                key={app._id}
                job={app}
                onEdit={(job) => {
                  setEditingJob(job);
                  setIsModalOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 h-full">
            <Icon
              icon="mdi:alert-circle-outline"
              className="text-4xl text-gray-400"
            />
            <p className="mt-2 text-lg text-gray-400">
              You haven't added any job applications
            </p>
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <JobForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingJob(null);
              }}
              defaultValues={editingJob || {}}
              isEditing={Boolean(editingJob)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default JobTracker;
