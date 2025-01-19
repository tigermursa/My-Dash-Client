import { ReactNode } from "react";
import MiniCalendar from "../GoalsAddons/MiniCalendar";

interface MainLayoutProps {
  children: ReactNode;
}

const GoalsLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex justify-between flex-col sm:flex-row h-full dark:bg-gray-900">
      {/* Main Content Section */}
      <div className="w-full sm:w-[78%] h-full">
        <div className="h-full overflow-y-auto scrollbar-none">{children}</div>
      </div>

      {/* MiniCalendar Section - hidden on small screens */}
      <div className="w-full sm:w-[20%] sm:block hidden sm:border-l border-gray-300 dark:border-gray-700 p-4 sm:h-auto h-full">
        <MiniCalendar />
      </div>
    </div>
  );
};

export default GoalsLayout;
