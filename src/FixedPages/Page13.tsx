import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  useGetAllDateEvents,
  useCreateDateEvent,
  useUpdateDateEvent,
  useDeleteDateEvent,
} from "../lib/eventApi";
import useAuth from "../hooks/useAuth";
import { DateEvent } from "../types/EventTypes";
import EventForm from "../components/Event/EventForm";
import EventCard from "../components/Event/EventCard";
import { toast } from "react-toastify";

interface ApiResponse {
  dateEvents: DateEvent[];
}

const Dates = () => {
  const { user } = useAuth();
  const userId = user?._id as string;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<DateEvent | null>(null);

  // Fetch all events
  const { data, isLoading, isError, refetch } = useGetAllDateEvents(userId);
  const dateEvents: DateEvent[] =
    (data as unknown as ApiResponse)?.dateEvents || [];

  const createMutation = useCreateDateEvent();
  const updateMutation = useUpdateDateEvent();
  const deleteMutation = useDeleteDateEvent();

  // Open modal for creating a new event or updating an existing one.
  const openModal = (event?: DateEvent) => {
    if (event) {
      setSelectedEvent(event);
    } else {
      setSelectedEvent(null);
    }
    setIsModalOpen(true);
  };

  // Handle form submission for create/update.
  const handleFormSubmit = async (formData: DateEvent) => {
    if (selectedEvent) {
      await updateMutation.mutateAsync({
        id: selectedEvent._id!,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
      toast.success("Created Successfully");
    }
    setIsModalOpen(false);
    refetch();
  };

  // Handle deletion of an event.
  const handleDeleteEvent = async (id: string) => {
    await deleteMutation.mutateAsync({ id, userId });
    refetch();
    toast.success("Deleted");
  };

  if (isLoading)
    return <div className="text-primary_one dark:text-white">Loading...</div>;
  if (isError) return <div className="text-red-500">Error fetching events</div>;

  return (
    <div className=" h-full p-4 md:p-8 dark:bg-gray-900 bg-gray-100 rounded-3xl  mt-20 md:mt-10 lg:mt-0 ">
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

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <EventForm
            isOpen={isModalOpen}
            initialValues={
              selectedEvent || { userId, eventName: "", eventDate: "" }
            }
            onSubmit={handleFormSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {dateEvents.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {dateEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={() => openModal(event)}
              onDelete={() => handleDeleteEvent(event._id!)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 h-full">
          <Icon
            icon="mdi:alert-circle-outline"
            className="text-4xl text-gray-400"
          />
          <p className="mt-2 text-lg text-gray-400">You did't add any date</p>
        </div>
      )}
    </div>
  );
};

export default Dates;
