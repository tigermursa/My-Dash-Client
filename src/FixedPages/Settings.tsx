import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNavItems, updateNavItems } from "../lib/navItemsApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import ToggleButton from "../components/Ui/Buttons/ToggleButton/ToggleButton";
import ThemeToggle from "../components/ThemeToggle";
import { Icon } from "@iconify/react/dist/iconify.js";

// Define your NavItem interface
interface NavItem {
  id: string;
  name: string;
  icon: string;
  href: string;
  group: string;
  isShow: boolean;
}

const Settings = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["navitems"],
    queryFn: fetchNavItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState<NavItem | null>(null);

  const { register, handleSubmit, reset } = useForm<NavItem>();

  const onSubmit: SubmitHandler<NavItem> = async (updatedData) => {
    if (selectedNavItem) {
      try {
        await updateNavItems(selectedNavItem.id, updatedData);
        refetch();
        setIsModalOpen(false);
        toast.success("Updated Success");
      } catch (error) {
        console.error("Failed to update", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  if (error) {
    console.error("Error fetching nav items:", error);
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading navigation items
      </div>
    );
  }

  const navItems: NavItem[] = data?.data || [];

  const openModal = (item: NavItem) => {
    setSelectedNavItem(item);
    reset(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 ">
      <div className=" p-6  flex justify-between items-center">
        <h1 className="text-xl font-semibold flex items-center gap-1 ">
          Setting Page{" "}
          <span className="animate-spin">
            <Icon icon={"mdi:cog"} className="h-6 w-6" />
          </span>
        </h1>
        <ThemeToggle />
      </div>

      {/* Responsive Table */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900  text-gray-800 dark:text-gray-100 ">
        {/* Responsive Table */}
        <div className=" rounded-3xl border border-gray-600 dark:border-gray-700 overflow-hidden border-b-0 ">
          <table className="min-w-full table-auto border-collapse  text-sm ">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th className="px-6 py-3 text-left w-1/6 border-b border-gray-600 dark:border-gray-700">
                  ID
                </th>
                <th className="px-6 py-3 text-left w-2/5 border-b border-gray-600 dark:border-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left w-1/5 border-b border-gray-600 dark:border-gray-700">
                  Group
                </th>
                <th className="px-6 py-3 text-center w-1/5 border-b border-gray-600 dark:border-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {navItems.map((item) => (
                <tr
                  key={item.id}
                  className="even:bg-gray-100 dark:even:bg-gray-800"
                >
                  <td className="px-6 py-3 border-b border-gray-600 dark:border-gray-700">
                    {item.id}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-600 dark:border-gray-700">
                    {item.name}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-600 dark:border-gray-700">
                    {item.group}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-600 dark:border-gray-700 text-center">
                    <div className="flex justify-center space-x-4">
                      <FaEdit
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={() => openModal(item)}
                      />
                      <ToggleButton
                        itemId={item.id}
                        initialIsShow={item.isShow}
                        refetch={refetch}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedNavItem && (
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
                  className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400"
                  id="name"
                  type="text"
                />
              </div>

              <div>
                <label htmlFor="icon" className="block mb-1">
                  Icon
                </label>
                <input
                  {...register("icon")}
                  className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400"
                  id="icon"
                  type="text"
                />
              </div>

              <div>
                <label htmlFor="group" className="block mb-1">
                  Group
                </label>
                <input
                  {...register("group")}
                  className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400"
                  id="group"
                  type="text"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
