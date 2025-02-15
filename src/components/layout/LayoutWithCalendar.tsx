import React, { ReactNode } from "react";
import MiniCalendar from "../GoalsAddons/MiniCalendar";

interface LayoutWithCalendarProps {
  children: ReactNode;
}

const LayoutWithCalendar: React.FC<LayoutWithCalendarProps> = ({
  children,
}) => {
  return (
    <div className="flex justify-between flex-col sm:flex-row h-full dark:bg-gray-900 mt-20 md:mt-10 lg:mt-0">
      {/* Main Content Section */}
      <div className="w-full sm:w-[78%] h-full mx-auto">
        <div className="h-full overflow-y-auto scrollbar-none">{children}</div>
      </div>

      {/* MiniCalendar Section - hidden on small screens */}
      <div className="w-full sm:w-[30%] 2xl:w-[20%] hidden xl:block mx-auto sm:border-l border-gray-300 dark:border-gray-700 p-4 sm:h-auto h-full">
        <MiniCalendar />
      </div>
    </div>
  );
};

export default LayoutWithCalendar;
