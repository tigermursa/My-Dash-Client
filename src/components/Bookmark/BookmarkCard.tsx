import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Bookmark } from "../../types/BookmarksTypes";

interface BookmarksCardProps {
  bookmark: Bookmark;
  onEdit: () => void;
  onDelete: () => void;
}

const BookmarksCard: React.FC<BookmarksCardProps> = ({
  bookmark,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2 max-w-full">
              <Icon
                icon="mdi:bookmark-outline"
                className="text-2xl text-primary_one flex-shrink-0"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {bookmark.name}
              </h3>
            </div>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary_one transition-colors truncate block"
            >
              <span className="truncate">{bookmark.url}</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 flex-shrink-0">
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

        {/* Visit Button */}
        <div className="mt-auto">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-2 bg-primary_one text-white rounded-lg hover:bg-primary_one/90 transition-colors flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:open-in-new" className="text-lg" />
              <span>Visit</span>
            </motion.button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default BookmarksCard;
