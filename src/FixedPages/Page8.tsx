import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/motions";

type ApplicationSource =
  | "LinkedIn"
  | "Company Website"
  | "Indeed"
  | "Referral"
  | "Other";
type EmploymentType = "remote" | "onsite" | "hybrid";
type InterestLevel = 1 | 2 | 3 | 4 | 5;
type ApplicationStatus =
  | "pending"
  | "interview"
  | "rejected"
  | "no_response"
  | "offer";

interface JobApplication {
  id: string;
  company: string;
  position: string;
  skills: string[];
  location: string;
  type: EmploymentType;
  status: ApplicationStatus;
  salary: string;
  interest: InterestLevel;
  source: ApplicationSource;
  easyApply: boolean;
  appliedDate: string;
}

const JobTracker = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<JobApplication, "id">>();

  useEffect(() => {
    const savedApps = localStorage.getItem("jobApplications");
    if (savedApps) setApplications(JSON.parse(savedApps));
  }, []);

  useEffect(() => {
    localStorage.setItem("jobApplications", JSON.stringify(applications));
  }, [applications]);

  const addApplication = (newApp: Omit<JobApplication, "id">) => {
    setApplications((prev) => [
      ...prev,
      { ...newApp, id: Date.now().toString() },
    ]);
  };

  const updateStatus = (id: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const onSubmit = (data: Omit<JobApplication, "id">) => {
    const newApp = {
      ...data,
      appliedDate: new Date().toISOString(),
      status: data.status || "pending",
    };
    addApplication(newApp);
    setIsModalOpen(false);
    reset();
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
      className="p-6 dark:bg-primarydarkbg min-h-screen"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <motion.div
              key={app.id}
              variants={fadeIn("up", 0.2)}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-primary_one/20 relative"
            >
              <div className="absolute top-2 right-2">
                <select
                  value={app.status}
                  onChange={(e) =>
                    updateStatus(app.id, e.target.value as ApplicationStatus)
                  }
                  className={`text-sm px-2 py-1 rounded-lg ${getStatusColor(
                    app.status
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="interview">Interview</option>
                  <option value="rejected">Rejected</option>
                  <option value="no_response">No Response</option>
                  <option value="offer">Offer</option>
                </select>
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold dark:text-primary_one">
                    {app.company}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {app.position}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:map-marker" className="text-gray-500" />
                  <span className="dark:text-gray-300">{app.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="mdi:source-branch" className="text-gray-500" />
                  <span className="dark:text-gray-300">{app.source}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="mdi:clock" className="text-gray-500" />
                  <span className="dark:text-gray-300">
                    Applied: {new Date(app.appliedDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="mdi:heart" className="text-gray-500" />
                  <div className="flex">
                    {renderInterestStars(app.interest)}
                  </div>
                </div>
              </div>

              {/* Employment Type Badge */}
              <span className="absolute bottom-2 right-2 px-3 py-1 bg-primary_one/10 text-primary_one dark:bg-primary_one/20 dark:text-primary_one rounded-full text-sm">
                {app.type.charAt(0).toUpperCase() + app.type.slice(1)}
              </span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-6 dark:text-primary_one">
                  Add Application
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
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

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary_one text-white rounded-lg hover:bg-primary_one"
                    >
                      Add Application
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
