import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface NotepadProps {
  title: string;
  storageKey: string;
}

const Notepad: React.FC<NotepadProps> = ({ title, storageKey }) => {
  const [note, setNote] = useState<string>("");

  // Load saved note from localStorage
  useEffect(() => {
    const savedNote = localStorage.getItem(storageKey);
    if (savedNote) setNote(savedNote);
  }, [storageKey]);

  // Save note to localStorage
  const handleNoteChange = (content: string) => {
    setNote(content);
    localStorage.setItem(storageKey, content);
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-3xl overflow-hidden">
      <div className="w-full h-full bg-white shadow-lg rounded-lg border-gray-400 relative">
        <h2 className="text-sm pt-2 pb-1 font-bold text-center text-gray-700">
          📝 {title}
        </h2>
        {/* ReactQuill Component */}
        <ReactQuill
          value={note}
          onChange={handleNoteChange}
          modules={{
            toolbar: [
              ["bold", "italic", "underline"], // Basic formatting
              [{ size: [] }], // Font size
              [{ font: [] }], // Font selection
              [{ color: [] }], // Text color
            ],
          }}
          className="w-full h-full font-medium bg-yellow-50 border-gray-300 shadow-sm focus:outline-none resize-none leading-loose"
        />
      </div>
      {/* Inline CSS for scrolling without visible scrollbar */}
      <style>{`
        .ql-editor {
          spellcheck: false;
          font-size: 16px;
          max-height: 80vh;
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
