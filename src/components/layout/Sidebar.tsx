import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import { fetchNavItems } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";

// Define the type for navigation items
interface NavItem {
  id: string;
  name: string;
  icon: string;
  href: string;
  group: string;
}

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  // Fetching nav items from the backend with React Query
  const { data, error, isLoading } = useQuery({
    queryKey: ["navitems"],
    queryFn: fetchNavItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error fetching nav items:", error);
    return <div>Error loading navigation items</div>;
  }

  const navItems: NavItem[] = data?.data || [];

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
      <aside className="hidden w-64 bg-white dark:bg-indigo-800 shadow-md lg:flex flex-col transition-colors duration-200">
        <div className="p-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Dash
          </h1>
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
                  <Icon icon={item.icon} className="mr-4 h-6 w-6" />
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
