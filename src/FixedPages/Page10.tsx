import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface Experience {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExperience, setNewExperience] = useState({
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });

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

    // Validate dates
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
      id: Date.now(),
      endDate: newExperience.isCurrent ? "" : newExperience.endDate,
    };

    setExperiences([experience, ...experiences]);
    setNewExperience({
      companyName: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    });
  };

  const deleteExperience = (id: number) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  // Component for displaying start and end dates
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
        <Icon icon="mdi:calendar-start" className="text-light_green/80" />
        <span className="text-light_green text-sm">
          Start: {formatDate(start)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon="mdi:calendar-end" className="text-light_green/80" />
        <span className="text-light_green text-sm">
          End: {isCurrent ? "Present" : formatDate(end)}
        </span>
      </div>
    </div>
  );

  // Helper function to calculate duration for individual experience
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
    <div className="min-h-screen p-4 md:p-8 bg-primarydarkbg">
      {/* Total Experience Counter */}
      <motion.div
        className="mb-8 p-6 rounded-xl bg-dark_green/10 backdrop-blur-sm border border-dark_green/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 text-light_green">
          <Icon icon="mdi:briefcase-clock" className="text-3xl" />
          <div>
            <h2 className="text-xl font-semibold">
              Total Professional Experience
            </h2>
            <p className="text-lighter_green font-bold text-2xl">
              {experiences.length > 0
                ? calculateTotalExperience()
                : "Add your first experience"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Add Experience Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="mb-8 p-6 rounded-xl bg-dark_green/10 backdrop-blur-sm border border-dark_green/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Company Name */}
          <div className="relative">
            <Icon
              icon="mdi:office-building"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light_green/80"
            />
            <input
              type="text"
              placeholder="Company Name"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-light_green border border-dark_green focus:outline-none focus:border-lighter_green"
              value={newExperience.companyName}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  companyName: e.target.value,
                })
              }
            />
          </div>

          {/* Position */}
          <div className="relative">
            <Icon
              icon="mdi:briefcase"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light_green/80"
            />
            <input
              type="text"
              placeholder="Position"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-light_green border border-dark_green focus:outline-none focus:border-lighter_green"
              value={newExperience.position}
              onChange={(e) =>
                setNewExperience({ ...newExperience, position: e.target.value })
              }
            />
          </div>

          {/* Start Date */}
          <div className="relative">
            <Icon
              icon="mdi:calendar-start"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light_green/80"
            />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-light_green border border-dark_green focus:outline-none focus:border-lighter_green"
              value={newExperience.startDate}
              max={new Date().toISOString().split("T")[0]} // Cannot select future dates
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  startDate: e.target.value,
                })
              }
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <Icon
              icon="mdi:calendar-end"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light_green/80"
            />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-light_green border border-dark_green focus:outline-none focus:border-lighter_green disabled:opacity-50"
              value={newExperience.endDate}
              min={newExperience.startDate} // End date cannot be before start date
              onChange={(e) =>
                setNewExperience({ ...newExperience, endDate: e.target.value })
              }
              disabled={newExperience.isCurrent}
            />
          </div>

          {/* Current Job Checkbox */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-light_green cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-dark_green"
                checked={newExperience.isCurrent}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    isCurrent: e.target.checked,
                  })
                }
              />
              Currently Working
            </label>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-auto px-6 py-2 bg-dark_green text-primarydarkbg rounded-lg hover:bg-darker_green transition-colors"
              type="submit"
            >
              Add
            </motion.button>
          </div>
        </div>
      </motion.form>

      {/* Experience List */}
      <AnimatePresence>
        {experiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 text-light_green/50"
          >
            <Icon
              icon="mdi:briefcase-remove"
              className="text-4xl mb-4 mx-auto"
            />
            <p>No experiences added yet</p>
          </motion.div>
        ) : (
          experiences.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="group mb-4 p-4 rounded-xl bg-primarydarkbg/80 backdrop-blur-sm border border-dark_green hover:border-lighter_green transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Company Name */}
                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:office-building"
                    className="text-light_green/80 flex-shrink-0"
                  />
                  <span className="text-light_green font-semibold truncate">
                    {exp.companyName}
                  </span>
                </div>

                {/* Position */}
                <div className="flex items-center gap-2 text-light_green">
                  <Icon icon="mdi:briefcase" />
                  {exp.position}
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-light_green">
                  <ExperienceDates
                    start={exp.startDate}
                    end={exp.endDate}
                    isCurrent={exp.isCurrent}
                  />
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-lighter_green">
                  <Icon icon="mdi:clock-time-three-outline" />
                  {calculateDuration(exp.startDate, exp.endDate, exp.isCurrent)}
                </div>

                {/* Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 justify-self-end"
                  onClick={() => deleteExperience(exp.id)}
                >
                  <Icon icon="mdi:trash-can-outline" />
                  <span className="md:hidden">Delete</span>
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default Experience;
