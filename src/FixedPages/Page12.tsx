import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  useGetAllBookmarks,
  useCreateBookmark,
  useUpdateBookmark,
  useDeleteBookmark,
} from "../lib/bookmarkApi";
import useAuth from "../hooks/useAuth";
import { Bookmark } from "../types/BookmarksTypes";
import BookmarksForm from "../components/Bookmark/BookmarkForm";
import BookmarksCard from "../components/Bookmark/BookmarkCard";

interface ApiResponse {
  bookmarks: Bookmark[];
}

const Bookmarks = () => {
  const { user } = useAuth();
  const userId = user?._id as string;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );

  // Fetch all bookmarks
  const { data, isLoading, isError, refetch } = useGetAllBookmarks(userId);
  const createMutation = useCreateBookmark();
  const updateMutation = useUpdateBookmark();
  const deleteMutation = useDeleteBookmark();

  const bookmarks: Bookmark[] =
    (data as unknown as ApiResponse)?.bookmarks || [];

  // Open modal for creating a new bookmark or updating an existing one.
  const openModal = (bookmark?: Bookmark) => {
    if (bookmark) {
      setSelectedBookmark(bookmark);
    } else {
      setSelectedBookmark(null);
    }
    setIsModalOpen(true);
  };

  // Handle form submission for create/update.
  const handleFormSubmit = async (formData: Bookmark) => {
    if (selectedBookmark) {
      // Update existing bookmark.
      await updateMutation.mutateAsync({
        id: selectedBookmark._id!,
        data: formData,
      });
    } else {
      // Create new bookmark.
      await createMutation.mutateAsync(formData);
    }
    setIsModalOpen(false);
    refetch();
  };

  // Handle deletion of a bookmark.
  const handleDeleteBookmark = async (id: string) => {
    await deleteMutation.mutateAsync({ id, userId });
    refetch();
  };

  if (isLoading)
    return <div className="text-primary_one dark:text-white">Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error fetching bookmarks</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 dark:bg-gray-900 bg-gray-100 rounded-3xl mt-20 md:mt-10 lg:mt-0">
      {/* Add Bookmark Button */}
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
          Add Bookmark
        </motion.button>
      </motion.div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <BookmarksForm
            isOpen={isModalOpen}
            initialValues={selectedBookmark || { userId, name: "", url: "" }}
            onSubmit={handleFormSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Bookmarks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarksCard
            key={bookmark._id}
            bookmark={bookmark}
            onEdit={() => openModal(bookmark)}
            onDelete={() => handleDeleteBookmark(bookmark._id!)}
          />
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
