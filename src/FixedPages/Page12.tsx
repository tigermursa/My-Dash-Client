import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  useGetAllBookmarks,
  useCreateBookmark,
  useUpdateBookmark,
  useDeleteBookmark,
} from "../lib/bookmarkApi"; // Import the API hooks
import useAuth from "../hooks/useAuth";

interface Bookmark {
  _id?: string; // MongoDB ID for updates
  userId: string;
  name: string;
  url: string;
}

interface ApiResponse {
  bookmarks: Bookmark[];
}

const Bookmarks = () => {
  const { user } = useAuth();
  const userId = user?._id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  ); // For updating bookmarks
  const { control, handleSubmit, reset } = useForm<Bookmark>({
    defaultValues: {
      userId: userId,
      name: "",
      url: "",
    },
  });

  // Fetch all bookmarks
  const { data, isLoading, isError, refetch } = useGetAllBookmarks(userId);
  const createMutation = useCreateBookmark();
  const updateMutation = useUpdateBookmark();
  const deleteMutation = useDeleteBookmark();

  // Open modal for creating or updating
  const openModal = (bookmark?: Bookmark) => {
    if (bookmark) {
      setSelectedBookmark(bookmark);
      reset(bookmark); // Pre-fill form for update
    } else {
      setSelectedBookmark(null);
      reset({ userId, name: "", url: "" }); // Reset form for create
    }
    setIsModalOpen(true);
  };

  const bookmarks = (data as unknown as ApiResponse)?.bookmarks || [];

  console.log(bookmarks);
  // Handle form submission for create/update
  const onSubmit = async (data: Bookmark) => {
    if (selectedBookmark) {
      // Update bookmark
      await updateMutation.mutateAsync({ id: selectedBookmark._id!, data });
    } else {
      // Create bookmark
      await createMutation.mutateAsync(data);
    }
    setIsModalOpen(false);
    refetch(); // Refetch data to update the UI
  };

  // Handle delete
  const deleteBookmark = async (id: string) => {
    await deleteMutation.mutateAsync({ id, userId });
    refetch(); // Refetch data to update the UI
  };

  if (isLoading)
    return <div className="text-primary_one dark:text-white">Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error fetching bookmarks</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 dark:bg-gray-900 bg-gray-100 rounded-3xl">
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
                    {selectedBookmark ? "Update Bookmark" : "Add New Bookmark"}
                  </h2>
                  <button
                    type="button"
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <Icon icon="mdi:close" className="text-2xl" />
                  </button>
                </div>

                {/* Bookmark name */}
                <div className="relative mb-4">
                  <Icon
                    icon="mdi:bookmark-outline"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  />
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Bookmark name"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary_one"
                      />
                    )}
                  />
                </div>

                {/* Bookmark URL */}
                <div className="relative mb-4">
                  <Icon
                    icon="mdi:link"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  />
                  <Controller
                    name="url"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="url"
                        placeholder="Bookmark URL"
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
                    {selectedBookmark ? "Update" : "Add Bookmark"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookmarks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks?.map((bookmark) => (
          <motion.div
            key={bookmark._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-lg bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {bookmark?.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(bookmark)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Icon icon="mdi:pencil" className="text-xl" />
                </button>
                <button
                  onClick={() => deleteBookmark(bookmark._id!)}
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
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
