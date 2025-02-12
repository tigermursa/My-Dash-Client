import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { DateEvent } from "../../types/EventTypes";

interface DateEventCardProps {
  event: DateEvent;
  onEdit: () => void;
  onDelete: () => void;
}

const EventCard: React.FC<DateEventCardProps> = ({
  event,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 rounded-lg bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {event.eventName}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Icon icon="mdi:pencil" className="text-xl" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Icon icon="mdi:delete" className="text-xl" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Date: {new Date(event.eventDate).toLocaleDateString()}
      </p>
    </motion.div>
  );
};

export default EventCard;
