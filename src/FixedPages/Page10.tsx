import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface Experience {
  userId: string;
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExperience, setNewExperience] = useState({
    userId: "user-123", // Replace with dynamic user ID in real implementation
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });
  const [showModal, setShowModal] = useState(false);

  // Calculate total experience duration
  const calculateTotalExperience = () => {
    const totalMonths = experiences.reduce((acc, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.isCurrent ? new Date() : new Date(exp.endDate);
      const diff =
        end.getMonth() -
        start.getMonth() +
        12 * (end.getFullYear() - start.getFullYear());
      return acc + diff;
    }, 0);

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return `${years} years ${months} months`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newExperience.companyName ||
      !newExperience.position ||
      !newExperience.startDate
    )
      return;

    const startDate = new Date(newExperience.startDate);
    const endDate = newExperience.isCurrent
      ? null
      : new Date(newExperience.endDate);

    if (endDate && endDate < startDate) {
      alert("End date cannot be before start date!");
      return;
    }

    const experience: Experience = {
      ...newExperience,
      id: Date.now().toString(),
      endDate: newExperience.isCurrent ? "" : newExperience.endDate,
    };

    setExperiences([experience, ...experiences]);
    setNewExperience({
      ...newExperience,
      companyName: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    });
    setShowModal(false);
  };

  const deleteExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  const ExperienceDates = ({
    start,
    end,
    isCurrent,
  }: {
    start: string;
    end: string;
    isCurrent: boolean;
  }) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Icon icon="mdi:calendar-start" className="text-blue-500/80" />
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {formatDate(start)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon="mdi:calendar-end" className="text-blue-500/80" />
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {isCurrent ? "Present" : end ? formatDate(end) : "-"}
        </span>
      </div>
    </div>
  );

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

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 relative">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Work Experience
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <Icon icon="mdi:plus" className="text-xl" />
            Add Experience
          </motion.button>
        </div>

        {/* Experience Summary */}
        <motion.div
          className="mb-8 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 text-blue-600">
            <Icon icon="mdi:briefcase-clock" className="text-3xl" />
            <div>
              <h2 className="text-xl font-semibold">Total Experience</h2>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                {experiences.length > 0
                  ? calculateTotalExperience()
                  : "No experience added"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Experience List */}
        <AnimatePresence>
          {experiences.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="text-gray-400 dark:text-gray-500">
                <Icon
                  icon="mdi:briefcase-remove"
                  className="text-4xl mb-4 mx-auto"
                />
                <p>No work experiences added yet</p>
              </div>
            </motion.div>
          ) : (
            experiences.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="group mb-4 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Timeline */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <Icon icon="mdi:calendar-range" className="text-lg" />
                      {calculateDuration(
                        exp.startDate,
                        exp.endDate,
                        exp.isCurrent
                      )}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="md:col-span-8">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {exp.position}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                      <Icon icon="mdi:office-building" />
                      <span>{exp.companyName}</span>
                    </div>
                    <ExperienceDates
                      start={exp.startDate}
                      end={exp.endDate}
                      isCurrent={exp.isCurrent}
                    />
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => deleteExperience(exp.id)}
                    >
                      <Icon icon="mdi:trash-can-outline" className="text-xl" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Experience Modal */}
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
                  Add Experience
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <Icon icon="mdi:close" className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <Icon
                        icon="mdi:office-building"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Google"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newExperience.companyName}
                        onChange={(e) =>
                          setNewExperience({
                            ...newExperience,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Position
                    </label>
                    <div className="relative">
                      <Icon
                        icon="mdi:briefcase"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Software Engineer"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newExperience.position}
                        onChange={(e) =>
                          setNewExperience({
                            ...newExperience,
                            position: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <Icon
                          icon="mdi:calendar-start"
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newExperience.startDate}
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) =>
                            setNewExperience({
                              ...newExperience,
                              startDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <div className="relative">
                        <Icon
                          icon="mdi:calendar-end"
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          value={newExperience.endDate}
                          min={newExperience.startDate}
                          onChange={(e) =>
                            setNewExperience({
                              ...newExperience,
                              endDate: e.target.value,
                            })
                          }
                          disabled={newExperience.isCurrent}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={newExperience.isCurrent}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          isCurrent: e.target.checked,
                        })
                      }
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Currently work here
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    type="submit"
                  >
                    Add Experience
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Experience;
