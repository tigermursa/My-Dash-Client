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
      className="p-4 rounded-lg bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {bookmark.name}
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
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 bg-primary_one text-white rounded-lg hover:bg-primary_one/90 transition-colors"
        >
          Visit
        </motion.button>
      </a>
    </motion.div>
  );
};

export default BookmarksCard;
