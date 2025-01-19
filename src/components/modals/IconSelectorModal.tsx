import { Icon } from "@iconify/react";

interface IconSelectorModalProps {
  isOpen: boolean;
  icons: Record<string, string>;
  onClose: () => void;
  onSelect: (icon: string) => void;
}

const IconSelectorModal = ({
  isOpen,
  icons,
  onClose,
  onSelect,
}: IconSelectorModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Select Icon</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(icons).map(([label, icon]) => (
            <button
              key={icon}
              type="button"
              onClick={() => onSelect(icon)}
              className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <Icon icon={icon} className="h-8 w-8" />
              <span className="text-xs text-center">{label}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 px-4 py-2 rounded text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IconSelectorModal;
