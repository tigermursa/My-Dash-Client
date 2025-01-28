import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface DateEvent {
  id: number;
  eventName: string;
  eventDate: string;
}

const Dates = () => {
  const [dates, setDates] = useState<DateEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm<DateEvent>({
    defaultValues: {
      eventName: "",
      eventDate: "",
    },
  });

  // Load dates from localStorage on component mount
  useEffect(() => {
    const storedDates = localStorage.getItem("dates");
    if (storedDates) {
      setDates(JSON.parse(storedDates));
    }
  }, []);

  // Save dates to localStorage whenever dates state changes
  useEffect(() => {
    localStorage.setItem("dates", JSON.stringify(dates));
  }, [dates]);

  const onSubmit = (data: DateEvent) => {
    const dateEvent: DateEvent = {
      ...data,
      id: Date.now(),
    };
    setDates([dateEvent, ...dates]);
    reset();
    setIsModalOpen(false);
  };

  const deleteDate = (id: number) => {
    setDates(dates.filter((date) => date.id !== id));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-primarydarkbg">
      {/* Add Date Button */}
      <motion.div
        className="mb-8 flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2 bg-primary_one text-primarydarkbg rounded-lg hover:bg-primary_one transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Icon icon="mdi:plus" className="text-xl" />
          Add Date
        </motion.button>
      </motion.div>

      {/* Modal Backdrop */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 rounded-xl bg-primary_one/10 backdrop-blur-sm border border-primary_one/30"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-primary_one">
                    Add New Date
                  </h2>
                  <button
                    type="button"
                    className="text-primary_one/50 hover:text-primary_one"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <Icon icon="mdi:close" className="text-2xl" />
                  </button>
                </div>

                {/* Event Name */}
                <div className="relative mb-4">
                  <Icon
                    icon="mdi:calendar-text"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
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
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                      />
                    )}
                  />
                </div>

                {/* Event Date */}
                <div className="relative mb-4">
                  <Icon
                    icon="mdi:calendar"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                  />
                  <Controller
                    name="eventDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                      />
                    )}
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="px-6 py-2 text-primary_one hover:bg-primary_one/20 rounded-lg transition-colors"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2 bg-primary_one text-primarydarkbg rounded-lg hover:bg-primary_one transition-colors"
                  >
                    Add Date
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dates.map((date) => (
          <motion.div
            key={date.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-lg bg-primary_one/10 backdrop-blur-sm border border-primary_one/30"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-primary_one">
                {date.eventName}
              </h3>
              <button
                onClick={() => deleteDate(date.id)}
                className="text-primary_one/50 hover:text-primary_one"
              >
                <Icon icon="mdi:delete" className="text-xl" />
              </button>
            </div>
            <p className="text-sm text-primary_one/80">
              Date: {new Date(date.eventDate).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dates;
