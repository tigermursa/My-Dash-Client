import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface Book {
  id: number;
  name: string;
  totalPages: number;
  targetDate: string;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({
    name: "",
    totalPages: "",
    targetDate: "",
  });

  const calculateDailyPages = (
    totalPages: number,
    targetDate: string
  ): number | string => {
    const today = new Date();
    const target = new Date(targetDate);
    const timeDiff = target.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysRemaining < 1) return "Target date passed";
    return Math.ceil(totalPages / daysRemaining);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.name || !newBook.totalPages || !newBook.targetDate) return;

    const book: Book = {
      ...newBook,
      id: Date.now(),
      totalPages: parseInt(newBook.totalPages),
    };

    setBooks([book, ...books]);
    setNewBook({ name: "", totalPages: "", targetDate: "" });
  };

  const deleteBook = (id: number) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-primarydarkbg">
      <motion.form
        onSubmit={handleSubmit}
        className="mb-8 p-6 rounded-xl bg-primary_dark/10 backdrop-blur-sm border border-primary_dark/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Icon
              icon="mdi:book-outline"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_light/80"
            />
            <input
              type="text"
              placeholder="Book Name"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_light border border-primary_dark focus:outline-none focus:border-primary_lighter"
              value={newBook.name}
              onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
            />
          </div>

          <div className="relative">
            <Icon
              icon="mdi:page-layout-header"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_light/80"
            />
            <input
              type="number"
              placeholder="Total Pages"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_light border border-primary_dark focus:outline-none focus:border-primary_lighter"
              value={newBook.totalPages}
              onChange={(e) =>
                setNewBook({ ...newBook, totalPages: e.target.value })
              }
              min="1"
            />
          </div>

          <div className="relative">
            <Icon
              icon="mdi:calendar"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_light/80"
            />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_light border border-primary_dark focus:outline-none focus:border-primary_lighter"
              value={newBook.targetDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setNewBook({ ...newBook, targetDate: e.target.value })
              }
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 p-2 bg-primary_dark text-primarydarkbg rounded-lg hover:bg-primary_darker transition-colors"
            type="submit"
          >
            <Icon icon="mdi:plus" className="text-xl" />
            Add Book
          </motion.button>
        </div>
      </motion.form>

      <AnimatePresence>
        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 text-primary_light/50"
          >
            <Icon icon="mdi:bookshelf" className="text-4xl mb-4 mx-auto" />
            <p>No books added yet</p>
          </motion.div>
        ) : (
          books.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              layout
              className="group mb-4 p-4 rounded-xl bg-primarydarkbg/80 backdrop-blur-sm border border-primary_dark hover:border-primary_lighter transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:book-open-outline"
                    className="text-primary_light/80 flex-shrink-0"
                  />
                  <span className="text-primary_light font-semibold truncate">
                    {book.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-primary_light">
                  <Icon icon="mdi:page-layout-header" />
                  {book.totalPages}
                </div>

                <div className="flex items-center gap-2 text-primary_light">
                  <Icon icon="mdi:calendar" />
                  {new Date(book.targetDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <div className="flex items-center gap-2 text-primary_lighter font-bold">
                  <Icon icon="mdi:run-fast" />
                  {calculateDailyPages(book.totalPages, book.targetDate)}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 justify-self-end"
                  onClick={() => deleteBook(book.id)}
                >
                  <Icon icon="mdi:trash-can-outline" />
                  <span className="md:hidden">Delete</span>
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookList;
