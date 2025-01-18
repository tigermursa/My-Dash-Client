import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import { fetchNavItemsByUser } from "../../lib/navItemsApi";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { NavItem } from "../../types/NavTypes";
import LogoutButton from "../Ui/Buttons/LogoutButton/LogoutButton";

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const { user } = useAuth();

  // Fetching nav items from the backend with React Query
  const { data, error, isLoading } = useQuery({
    queryKey: ["navitems", user?._id], // Use user ID as part of the query key
    queryFn: () => fetchNavItemsByUser(user?._id as string), // Function that calls the API
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    console.error("Error fetching nav items:", error);
    return <div>Error loading navigation items</div>;
  }

  const navData: NavItem[] = data?.data ?? [];

  const navItems = navData.filter((item) => item.isShow);

  // Group navItems by 'group' key
  const groupedNavItems: Record<string, NavItem[]> = navItems.reduce(
    (acc: Record<string, NavItem[]>, item: NavItem) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {}
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 bg-gray-50 dark:bg-primarydarkbg shadow-md lg:flex flex-col transition-colors duration-200 m-5 border dark:border-dark_green rounded-3xl">
        <div className="p-4 ">
          <div className="flex justify-center items-center gap-1">
            <div className="flex items-center  gap-1">
              <img
                src="/logo.png"
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <h1 className="text-2xl font-extrabold bebas-neue-regular text-gray-900 dark:text-white">
                My D<span className="text-dark_green">a</span>sh
              </h1>
            </div>
            <div>
              <LogoutButton />
            </div>
          </div>
        </div>
        <nav className="px-2 flex-1 overflow-y-auto scrollbar-hide">
          {Object.entries(groupedNavItems).map(([group, items], index, arr) => (
            <div key={group} className="mt-4">
              {/* Group Title */}
              <h2 className="px-2 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold tracking-wide">
                {group.replace(/-/g, " ")}
              </h2>

              {items.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md transition-colors duration-200 ${
                    pathname === item.href
                      ? "bg-gray-100 dark:bg-gray-200 dark:bg-opacity-10 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon
                    icon={item.icon}
                    className="mr-4 h-6 w-6 text-darker_green dark:text-lighter_green"
                  />
                  {item.name}
                </Link>
              ))}

              {/* Divider between groups */}
              {index < arr.length - 1 && (
                <hr className="my-3 border-gray-300 dark:border-gray-600" />
              )}
            </div>
          ))}
        </nav>
        {/* user info */}
        <div className="p-4 flex items-center space-x-4 border-t border-gray-600">
          <img
            src="https://img.freepik.com/premium-photo/cute-girl-with-pretty-face-creative-ai_634423-2799.jpg"
            alt="User"
            className="w-12 h-12 rounded-full object-cover border-2 border-light_green"
          />
          <div className="flex items-center space-x-2">
            {user ? (
              <span className="text-xl truncate font-semibold text-gray-900 dark:text-white">
                {user?.username}
              </span>
            ) : (
              <span className="text-xl truncate font-semibold text-gray-900 dark:text-white">
                Nazuku Uzia
              </span>
            )}

            <Link to={"/settings"}>
              <span>
                <Icon
                  icon="mdi:cog"
                  className="w-6 h-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer hover:animate-spin"
                />
              </span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-indigo-800 shadow-md lg:hidden transition-colors duration-200 z-10">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 dark:bg-indigo-800 shadow-md lg:hidden transition-colors duration-200">
        <div className="overflow-x-auto scrollbar-hide">
          <ul className="flex whitespace-nowrap py-2">
            {navItems.map((item) => (
              <li key={item.id} className="inline-block px-2">
                <Link
                  to={item.href}
                  className={`flex flex-col items-center p-2 transition-colors duration-200 ${
                    pathname === item.href
                      ? "text-blue-600 dark:text-blue-100"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Icon icon={item.icon} className="h-6 w-6" />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
