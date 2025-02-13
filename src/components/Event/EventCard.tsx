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
  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group p-4 rounded-xl w-max mx-auto bg-white  dark:bg-gray-800/25 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start gap-3 ">
        {/* Event Name and Date */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:calendar" className="text-xl text-primary_one" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {event.eventName}
            </h3>
          </div>
          <p className=" text-4xl xl:text-5xl text-nowrap 2xl:text-7xl font-bold text-gray-600 dark:text-primary_one mt-1">
            {formattedDate}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-primary_one/10 rounded-full transition-colors"
          >
            <Icon
              icon="mdi:pencil"
              className="text-xl text-gray-500 hover:text-primary_one"
            />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
          >
            <Icon
              icon="mdi:trash-can-outline"
              className="text-xl text-gray-500 hover:text-red-500"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
