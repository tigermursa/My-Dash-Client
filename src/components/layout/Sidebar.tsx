import { Icon } from "@iconify/react";

import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

const navItems = [
  { name: "Home", icon: "mdi:home", href: "/" },
  { name: "Today", icon: "mdi:calendar-today", href: "/today" },
  { name: "This Week", icon: "mdi:calendar-week", href: "/this-week" },
  { name: "This Month", icon: "mdi:calendar-month", href: "/this-month" },
  { name: "Next 3 Months", icon: "mdi:calendar-clock", href: "/next-3-months" },
  { name: "Next Year", icon: "mdi:calendar-star", href: "/next-year" },
  {
    name: "Next 2 Years",
    icon: "mdi:calendar-multiple",
    href: "/next-2-years",
  },
  { name: "5 Year Plan", icon: "mdi:calendar-text", href: "/five-year-plan" },
  { name: "About", icon: "mdi:information", href: "/about" },
  { name: "Settings", icon: "mdi:cog", href: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 bg-white dark:bg-indigo-800 shadow-md lg:flex flex-col transition-colors duration-200">
        <div className="p-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Dash
          </h1>
        </div>
        <nav className="px-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
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
      <nav className="fixed bottom-0 left-0 right-0 dark:bg-indigo-800  shadow-md lg:hidden transition-colors duration-200">
        <div className="overflow-x-auto scrollbar-hide">
          <ul className="flex whitespace-nowrap py-2">
            {navItems.map((item) => (
              <li key={item.name} className="inline-block px-2">
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
