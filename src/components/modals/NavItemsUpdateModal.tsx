import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { NavItem } from "../../types/NavTypes";
import IconSelectorModal from "./IconSelectorModal";

interface NavItemsUpdateModalProps {
  isOpen: boolean;
  navItem: NavItem;
  onClose: () => void;
  onSubmit: SubmitHandler<NavItem>;
}

const ICONS = {
  Home: "mdi:home",
  Todo: "mdi:clipboard-check-outline",
  Note: "mdi:notebook-outline",
  Week: "mdi:calendar-week",
  Month: "mdi:calendar-month-outline",
  Year: "mdi:calendar-star",
  Skills: "mdi:school-outline",
  "Job Tracker": "mdi:briefcase-outline",
  "Book List": "mdi:book-open-outline",
  Experience: "mdi:account-tie-outline",
  Projects: "mdi:code-braces-box",
  Streaks: "mdi:fire",
  Dates: "mdi:calendar-clock",
  Ideas: "mdi:lightbulb-outline",
  Help: "mdi:help-circle-outline",
  "Productivity Dashboard": "mdi:chart-timeline-variant",
  Reminders: "mdi:bell-outline",
  Goals: "mdi:target-outline",
  Focus: "mdi:focus-field",
  Calendar: "mdi:calendar-edit",
  Insights: "mdi:chart-bar",
  Tags: "mdi:tag-outline",
  Files: "mdi:file-document-outline",
  "Contact List": "mdi:account-box-multiple",
};

const NavItemsUpdateModal = ({
  isOpen,
  navItem,
  onClose,
  onSubmit,
}: NavItemsUpdateModalProps) => {
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<NavItem>({
    defaultValues: navItem,
  });

  const selectedIcon = watch("icon", navItem.icon);

  const handleIconSelect = (icon: string) => {
    setValue("icon", icon);
    setIconModalOpen(false);
  };

  return (
    isOpen && (
      <>
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Nav Item</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1">
                  Name
                </label>
                <input
                  {...register("name")}
                  className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 dark:bg-gray-700"
                  id="name"
                  type="text"
                />
              </div>

              <div>
                <label htmlFor="icon" className="block mb-1">
                  Icon
                </label>
                <div className="flex items-center gap-4">
                  <Icon icon={selectedIcon} className="h-6 w-6" />
                  <button
                    type="button"
                    onClick={() => setIconModalOpen(true)}
                    className="text-blue-500 underline"
                  >
                    Change Icon
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="group" className="block mb-1">
                  Group
                </label>
                <input
                  {...register("group")}
                  className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 dark:bg-gray-700"
                  id="group"
                  type="text"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 px-4 py-2 rounded text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 px-4 py-2 rounded text-white"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>

        <IconSelectorModal
          isOpen={iconModalOpen}
          icons={ICONS}
          onClose={() => setIconModalOpen(false)}
          onSelect={handleIconSelect}
        />
      </>
    )
  );
};

export default NavItemsUpdateModal;
