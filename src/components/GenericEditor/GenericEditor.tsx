import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";

interface GenericEditorProps {
  title: string;
  icon: string;
  queryKey: string;
  fetchContent: (userId: string) => Promise<{ content: string }>;
  updateContent: (userId: string, content: string) => Promise<void>;
  clearContent: (userId: string) => Promise<void>;
}

const GenericEditor: React.FC<GenericEditorProps> = ({
  title,
  icon,
  queryKey,
  fetchContent,
  updateContent,
  clearContent,
}) => {
  const [note, setNote] = useState<string>("");
  const { user } = useAuth();

  const { data } = useQuery<{ content: string }, Error>({
    queryKey: [queryKey, user?._id],
    queryFn: () => fetchContent(user?._id as string),
    enabled: !!user?._id,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (data?.content) {
      setNote(data.content);
    }
  }, [data]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [note]);

  const saveMutation = useMutation({
    mutationFn: (newContent: string) =>
      updateContent(user?._id as string, newContent),
    onSuccess: () => toast.success(`${title} saved successfully!`),
    onError: (error) => {
      console.error(`Error saving ${title.toLowerCase()}:`, error);
      toast.error(`Failed to save ${title.toLowerCase()}`);
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => clearContent(user?._id as string),
    onSuccess: () => {
      setNote("");
      toast.success(`${title} cleared successfully!`);
    },
    onError: (error) => {
      console.error(`Error clearing ${title.toLowerCase()}:`, error);
      toast.error(`Failed to clear ${title.toLowerCase()}`);
    },
  });

  const handleNoteChange = (content: string) => setNote(content);
  const handleSave = () => saveMutation.mutate(note);
  const handleClear = () => clearMutation.mutate();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-3xl overflow-hidden">
      <div className="w-full h-full bg-white dark:bg-gray-950 shadow-lg rounded-lg relative">
        <div className="flex justify-start items-center px-4 pt-2">
          <h2 className="text-sm font-bold text-gray-950 dark:text-white flex items-center me-2">
            <Icon
              icon={icon}
              className="text-2xl text-gray-800 dark:text-gray-100"
            />
            {title}
          </h2>
          <div className="flex">
            <button
              onClick={handleSave}
              className="p-2 text-white rounded-full disabled:bg-gray-300"
              title="Save (Ctrl/Cmd + S)"
            >
              <Icon
                icon="bx-save"
                className="text-2xl text-gray-800 dark:text-gray-100"
              />
            </button>
            <button
              onClick={handleClear}
              className="text-white rounded-full disabled:bg-gray-300"
              title="Clear"
            >
              <Icon
                icon="hugeicons:clean"
                className="text-2xl text-gray-800 dark:text-gray-100"
              />
            </button>
          </div>
        </div>
        <ReactQuill
          value={note}
          onChange={handleNoteChange}
          modules={{
            toolbar: [
              ["bold", "italic", "underline"],
              [{ size: [] }],
              [{ font: [] }],
              [{ color: [] }],
            ],
          }}
          className="w-full h-full font-medium bg-yellow-50 dark:bg-gray-900 dark:text-white shadow-sm focus:outline-none resize-none leading-loose"
        />
      </div>
      <style>{`
        .ql-editor {
          spellcheck: false;
          font-size: 20px;
          max-height: 79vh;
          overflow-y: auto;
          padding-bottom: 20px;
        }
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

export default GenericEditor;
