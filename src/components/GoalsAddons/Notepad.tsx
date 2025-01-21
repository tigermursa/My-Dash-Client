import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import {
  getContentNotePad,
  updateContentNotePad,
  clearContentNotePad,
} from "../../lib/notepadApi";
import useAuth from "../../hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";

const Notepad: React.FC = () => {
  const [note, setNote] = useState<string>(""); // State for note content
  const { user } = useAuth();

  // Fetch note content from API
  const { data } = useQuery<{ contentNotePad: string }, Error>({
    queryKey: ["notepad", user?._id],
    queryFn: () => getContentNotePad(user?._id as string),
    enabled: !!user?._id,
    staleTime: 0, // Always refetch if cache is invalidated
    refetchOnWindowFocus: true, // Refetch if window regains focus
    refetchOnMount: true, // Refetch every time the component mounts
  });

  // Ensure note is updated when `data` changes
  useEffect(() => {
    if (data?.contentNotePad) {
      setNote(data.contentNotePad); // Sync state with fetched data
    }
  }, [data]);

  // Mutation for saving note content
  const saveMutation = useMutation({
    mutationFn: (newContent: string) =>
      updateContentNotePad(user?._id as string, newContent),
    onSuccess: () => {
      toast.success("Note saved successfully!");
    },
    onError: (error) => {
      console.error("Error saving note:", error);
      toast.error("Failed to save the note.");
    },
  });

  // Mutation for clearing note content
  const clearMutation = useMutation({
    mutationFn: () => clearContentNotePad(user?._id as string),
    onSuccess: () => {
      setNote(""); // Clear the note content in state
      toast.success("Note cleared successfully!");
    },
    onError: (error) => {
      console.error("Error clearing note:", error);
      toast.error("Failed to clear the note.");
    },
  });

  const handleNoteChange = (content: string) => {
    setNote(content); // Update note state when the editor content changes
  };

  const handleSave = () => {
    saveMutation.mutate(note); // Save the current note content
  };

  const handleClear = () => {
    clearMutation.mutate(); // Clear the current note content
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-3xl overflow-hidden">
      <div className="w-full h-full bg-white dark:bg-gray-950 shadow-lg rounded-lg relative">
        <div className="flex justify-start items-center px-4 pt-2">
          <h2 className="text-sm font-bold text-gray-950 dark:text-white flex items-center me-2">
            <Icon
              icon="ph:pencil-line-bold"
              className="text-2xl text-gray-800 dark:text-gray-100"
            />{" "}
            {"Notepad"}
          </h2>
          <div className="flex ">
            <button
              onClick={handleSave}
              className="p-2  text-white rounded-full  disabled:bg-gray-300"
              title="Save"
            >
              <Icon
                icon="bx-save"
                className="text-2xl text-gray-800 dark:text-gray-100"
              />
            </button>
            <button
              onClick={handleClear}
              className=" text-white rounded-full  disabled:bg-gray-300"
              title="Clear"
            >
              <Icon
                icon="hugeicons:clean"
                className="text-2xl text-gray-800 dark:text-gray-100"
              />
            </button>
          </div>
        </div>
        {/* ReactQuill Editor */}
        <ReactQuill
          value={note} // Bind the editor value to the note state
          onChange={handleNoteChange} // Update note state on content change
          modules={{
            toolbar: [
              ["bold", "italic", "underline"], // Basic formatting
              [{ size: [] }], // Font size
              [{ font: [] }], // Font selection
              [{ color: [] }], // Text color
            ],
          }}
          className="w-full h-full font-medium bg-yellow-50 dark:bg-gray-900 dark:text-white shadow-sm focus:outline-none resize-none leading-loose"
        />
      </div>
      {/* Inline CSS for hiding scrollbars */}
      <style>{`
        .ql-editor {
          spellcheck: false;
          font-size: 20px;
          max-height: 79vh;
          overflow-y: auto;
          padding-bottom: 20px;
          
        }
        /* Hide scrollbar */
        .ql-editor::-webkit-scrollbar {
          display: none;
        }
        .ql-editor {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Notepad;
