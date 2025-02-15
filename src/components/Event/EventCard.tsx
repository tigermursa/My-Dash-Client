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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02, rotate: -0.5 }}
      whileTap={{ scale: 0.98 }}
      className="group p-6 rounded-2xl w-max mx-auto bg-gradient-to-br from-blue-50/50 to-purple-50/80 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all border border-white/20 dark:border-gray-700 relative"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="flex justify-between items-start gap-4 relative">
        {/* Event Name and Date */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 relative">
            <div className="p-2 bg-primary_one/10 rounded-lg">
              <Icon
                icon="mdi:calendar-star"
                className="text-2xl text-primary_one drop-shadow-sm"
              />
            </div>
            {/* Tooltip Container */}
            <div className="relative group">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white/90 truncate max-w-[200px] cursor-default">
                {event.eventName}
              </h3>
              {/* Tooltip */}
              <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 backdrop-blur-md rounded-lg border border-white/10 shadow-lg transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-1 z-50">
                <p className="text-sm text-white whitespace-nowrap">
                  {event.eventName}
                </p>
              </div>
            </div>
          </div>

          <div className="ml-1">
            <p className="text-5xl xl:text-6xl font-extrabold bg-gradient-to-r from-primary_one to-blue-600 bg-clip-text text-transparent">
              {eventDate.getDate()}
            </p>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-lg">
                {eventDate.toLocaleString("default", { month: "long" })}
              </span>
              <span className="text-sm mt-1">{eventDate.getFullYear()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 ml-1">
            <Icon
              icon="mdi:run-fast"
              className="text-xl text-primary_one animate-pulse"
            />
            <span className="text-lg font-semibold text-gray-50 dark:text-primary_one/90">
              {event.dayLeft} days to go
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-primary_one/20 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <Icon
              icon="mdi:pencil-outline"
              className="text-2xl text-gray-600 hover:text-primary_one dark:text-gray-300"
            />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <Icon
              icon="mdi:trash-can-outline"
              className="text-2xl text-gray-600 hover:text-red-500 dark:text-gray-300"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
