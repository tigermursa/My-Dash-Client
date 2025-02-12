import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  useGetAllDateEvents,
  useCreateDateEvent,
  useUpdateDateEvent,
  useDeleteDateEvent,
} from "../lib/eventApi"; // Import the API hooks
import useAuth from "../hooks/useAuth";

interface DateEvent {
  _id?: string; // MongoDB ID for updates
  userId: string;
  eventName: string;
  eventDate: string;
}

interface ApiResponse {
  dateEvents: DateEvent[];
}

const Dates = () => {
  const { user } = useAuth();
  const userId = user?._id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DateEvent | null>(null); // For updating events
  const { control, handleSubmit, reset } = useForm<DateEvent>({
    defaultValues: {
      userId: userId,
      eventName: "",
      eventDate: "",
    },
  });

  // Fetch all events
  const { data, isLoading, isError, refetch } = useGetAllDateEvents(userId);
  const dates = (data as unknown as ApiResponse)?.dateEvents || [];

  const createMutation = useCreateDateEvent();
  const updateMutation = useUpdateDateEvent();
  const deleteMutation = useDeleteDateEvent();

  // Open modal for creating or updating
  const openModal = (event?: DateEvent) => {
    if (event) {
      setSelectedEvent(event);
      reset(event); // Pre-fill form for update
    } else {
      setSelectedEvent(null);
      reset({ userId, eventName: "", eventDate: "" }); // Reset form for create
    }
    setIsModalOpen(true);
  };

  // Handle form submission for create/update
  const onSubmit = async (data: DateEvent) => {
    if (selectedEvent) {
      // Update event
      await updateMutation.mutateAsync({ id: selectedEvent._id!, data });
    } else {
      // Create event
      await createMutation.mutateAsync(data);
    }
    setIsModalOpen(false);
    refetch(); // Refetch data to update the UI
  };

  // Handle delete
  const deleteDate = async (id: string) => {
    await deleteMutation.mutateAsync({ id, userId });
    refetch(); // Refetch data to update the UI
  };

  if (isLoading)
    return <div className="text-primary_one dark:text-white">Loading...</div>;
  if (isError) return <div className="text-red-500">Error fetching events</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 dark:bg-gray-900 bg-gray-100 rounded-3xl">
      {/* Add Date Button */}
      <motion.div
        className="mb-8 flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2 bg-primary_one text-white rounded-lg hover:bg-primary_one/90 transition-colors"
          onClick={() => openModal()}
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
                className="p-6 rounded-xl bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedEvent ? "Update Event" : "Add New Event"}
                  </h2>
                  <button
                    type="button"
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setIsModalOpen(false)}
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
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2 bg-primary_one text-white rounded-lg hover:bg-primary_one/90 transition-colors"
                  >
                    {selectedEvent ? "Update" : "Add Date"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dates?.map((date) => (
          <motion.div
            key={date._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-lg bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {date.eventName}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(date)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Icon icon="mdi:pencil" className="text-xl" />
                </button>
                <button
                  onClick={() => deleteDate(date._id!)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Icon icon="mdi:delete" className="text-xl" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Date: {new Date(date.eventDate).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dates;
