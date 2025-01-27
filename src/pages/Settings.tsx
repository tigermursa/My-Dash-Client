import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNavItemsByUser, updateNavItems } from "../lib/navItemsApi";
import { SubmitHandler } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import ToggleButton from "../components/Ui/Buttons/ToggleButton/ToggleButton";
import ThemeToggle from "../components/ThemeToggle";
import { Icon } from "@iconify/react/dist/iconify.js";
import { NavItem } from "../types/NavTypes";
import useAuth from "../hooks/useAuth";
import NavItemsUpdateModal from "../components/modals/NavItemsUpdateModal";
import ThemeSwitcher from "../components/ThemeSwitcher";

const Settings = () => {
  const { user } = useAuth();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["navitems", user?._id],
    queryFn: () => fetchNavItemsByUser(user?._id as string),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState<NavItem | null>(null);

  const handleUpdate: SubmitHandler<NavItem> = async (updatedData) => {
    if (selectedNavItem) {
      try {
        await updateNavItems(selectedNavItem.id, updatedData);
        refetch();
        setIsModalOpen(false);
        toast.success("Updated successfully!");
      } catch (error) {
        console.error("Failed to update nav item:", error);
        toast.error("Failed to update nav item");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading navigation items
      </div>
    );
  }

  const navItems: NavItem[] = data?.data || [];

  const openModal = (item: NavItem) => {
    setSelectedNavItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold flex items-center gap-1">
          Settings Page{" "}
          <span className="animate-spin">
            <Icon icon="mdi:cog" className="h-6 w-6" />
          </span>
        </h1>
        <ThemeToggle />
        <ThemeSwitcher />
      </div>

      <div className="p-6 bg-gray-50 dark:bg-gray-900">
        <div className="rounded-3xl border border-gray-600 overflow-hidden">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Group</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {navItems.map((item) => (
                <tr
                  key={item.id}
                  className="even:bg-gray-100 dark:even:bg-gray-800"
                >
                  <td className="px-6 py-3">{item.id}</td>
                  <td className="px-6 py-3">{item.name}</td>
                  <td className="px-6 py-3">{item.group}</td>
                  <td className="px-6 py-3 text-center">
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

      {isModalOpen && selectedNavItem && (
        <NavItemsUpdateModal
          isOpen={isModalOpen}
          navItem={selectedNavItem}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default Settings;
