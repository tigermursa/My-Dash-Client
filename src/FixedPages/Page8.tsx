import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/motions";
import {
  ApplicationStatus,
  InterestLevel,
  JobApplication,
} from "../types/JobsTypes";
import { fetchJobs, createJob, updateJob, deleteJob } from "../lib/jobsApi";
import useAuth from "../hooks/useAuth";

const JobTracker = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = user?._id as string;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobApplication>();

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const jobs = await fetchJobs(userId);
        setApplications(jobs);
        console.log("from jobs", jobs);
        setError(null);
      } catch (err) {
        console.log(err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, [userId]);

  const handleFormSubmit = async (data: JobApplication) => {
    try {
      const payload = {
        ...data,
        appliedDate: new Date(data.appliedDate).toISOString(),
        userId,
      };

      if (editingJob) {
        const updatedJob = await updateJob(editingJob._id!, payload);
        setApplications((prev) =>
          prev.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );
      } else {
        const newJob = await createJob(payload);
        setApplications((prev) => [...prev, newJob]);
      }

      setIsModalOpen(false);
      setEditingJob(null);
      reset();
    } catch (err) {
      console.log(err);
      setError("Failed to save application. Please try again.");
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await deleteJob(userId, jobId);
      setApplications((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.log(err);
      setError("Failed to delete application. Please try again.");
    }
  };

  const renderInterestStars = (level: InterestLevel) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Icon
        key={i}
        icon={i < level ? "mdi:star" : "mdi:star-outline"}
        className={`text-lg ${i < level ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "interview":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "offer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "no_response":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.1, 0.2)}
      className="p-6 dark:bg-gray-900 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            variants={fadeIn("down", 0.2)}
            className="text-3xl font-bold bg-gradient-to-r from-primary_one to-primary_one bg-clip-text text-transparent"
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

        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading applications...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <motion.div
                key={app._id}
                variants={fadeIn("up", 0.2)}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-primary_one/20 relative"
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingJob(app);
                      setIsModalOpen(true);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Icon
                      icon="mdi:pencil"
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(app._id!)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Icon icon="mdi:trash" className="text-red-500" />
                  </button>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold dark:text-primary_one">
                      {app?.company}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {app?.position}
                    </p>
                    <span
                      className={`inline-block mt-2 text-sm px-3 py-1 rounded-full ${getStatusColor(
                        app?.status
                      )}`}
                    >
                      {app?.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:map-marker" className="text-gray-500" />
                    <span className="dark:text-gray-300">{app?.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:source-branch" className="text-gray-500" />
                    <span className="dark:text-gray-300">{app?.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:clock" className="text-gray-500" />
                    <span className="dark:text-gray-300">
                      Applied: {new Date(app?.appliedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:heart" className="text-gray-500" />
                    <div className="flex">
                      {renderInterestStars(app?.interest)}
                    </div>
                  </div>

                  {app?.salary && (
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:cash" className="text-gray-500" />
                      <span className="dark:text-gray-300">{app?.salary}</span>
                    </div>
                  )}
                </div>

                <span className="absolute bottom-2 right-2 px-3 py-1 bg-primary_one/10 text-primary_one dark:bg-primary_one/20 dark:text-primary_one rounded-full text-sm">
                  {app.type.charAt(0).toUpperCase() + app.type.slice(1)}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setIsModalOpen(false);
                setEditingJob(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-6 dark:text-primary_one">
                  {editingJob ? "Edit Application" : "Add Application"}
                </h3>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-4"
                >
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
                      {...register("interest", {
                        required: true,
                        valueAsNumber: true,
                      })}
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
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingJob(null);
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary_one text-white rounded-lg hover:bg-primary_one"
                    >
                      {editingJob ? "Update Application" : "Add Application"}
                    </button>
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

export default JobTracker;
