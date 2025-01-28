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
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(false);
  };

  const deleteBook = (id: number) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-primarydarkbg relative">
      {/* Add Book Button */}
      <div className="flex justify-end mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-primary_one text-primarydarkbg rounded-lg hover:bg-primary_one transition-colors"
          onClick={() => setShowModal(true)}
        >
          <Icon icon="mdi:plus" className="text-xl" />
          Add Book
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-primarydarkbg rounded-xl p-6 w-full max-w-md border border-primary_one/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-primary_one">
                  Add New Book
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-primary_one/50 hover:text-primary_one"
                >
                  <Icon icon="mdi:close" className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Icon
                    icon="mdi:book-outline"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                  />
                  <input
                    type="text"
                    placeholder="Book Name"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                    value={newBook.name}
                    onChange={(e) =>
                      setNewBook({ ...newBook, name: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <Icon
                    icon="mdi:page-layout-header"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                  />
                  <input
                    type="number"
                    placeholder="Total Pages"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                  />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                    value={newBook.targetDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewBook({ ...newBook, targetDate: e.target.value })
                    }
                  />
                  <span className="text-xs text-primary_one/50 mt-1 block">
                    Minimum date: Today
                  </span>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-primary_one text-primarydarkbg rounded-lg hover:bg-primary_one transition-colors"
                    type="submit"
                  >
                    Add Book
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book List */}
      <AnimatePresence>
        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 text-primary_one/50"
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
              className="group mb-4 p-4 rounded-xl bg-primarydarkbg/80 backdrop-blur-sm border border-primary_one hover:border-primary_one transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:book-open-outline"
                    className="text-primary_one/80 flex-shrink-0"
                  />
                  <span className="text-primary_one font-semibold truncate">
                    {book.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-primary_one">
                  <Icon icon="mdi:page-layout-header" />
                  {book.totalPages}
                </div>

                <div className="flex items-center gap-2 text-primary_one">
                  <Icon icon="mdi:calendar" />
                  {new Date(book.targetDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <div className="flex items-center gap-2 text-primary_one font-bold">
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
