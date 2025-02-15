import React, { ReactNode } from "react";
import MiniCalendar from "../GoalsAddons/MiniCalendar";
import { useGetAllDateEvents } from "../../lib/eventApi";
import useAuth from "../../hooks/useAuth";
import SimpleLoader from "../Ui/Loader/SimpleLoader";
import { DateEvent } from "../../types/EventTypes";

interface LayoutWithCalendarProps {
  children: ReactNode;
}

interface ApiResponse {
  dateEvents: DateEvent[];
}

// Helper function to group events by month
const groupEventsByMonth = (events: DateEvent[]) => {
  const grouped = events.reduce((acc, event) => {
    const date = new Date(event.eventDate);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {} as Record<string, DateEvent[]>);

  // Sort months chronologically
  return Object.entries(grouped).sort((a, b) => {
    const dateA = new Date(a[1][0].eventDate);
    const dateB = new Date(b[1][0].eventDate);
    return dateA.getTime() - dateB.getTime();
  });
};

const LayoutWithCalendar: React.FC<LayoutWithCalendarProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const userId = user?._id as string;

  // Fetch all events
  const { data, isLoading } = useGetAllDateEvents(userId);

  // Extract and group events
  const dateEvents: DateEvent[] =
    (data as unknown as ApiResponse)?.dateEvents || [];
  const groupedEvents = groupEventsByMonth(dateEvents);

  return (
    <div className="flex flex-col sm:flex-row h-full dark:bg-gray-900 mt-20 md:mt-10 lg:mt-0">
      {/* Main Content Section */}
      <div className="w-full sm:w-[70%] lg:w-[65%] xl:w-[70%] h-full mx-auto">
        <div className="h-full overflow-y-auto scrollbar-none">{children}</div>
      </div>

      {/* Calendar and Events Section */}
      <div className="hidden xl:block w-full sm:w-[30%] xl:w-[30%] 2xl:w-[25%] sm:border-l border-gray-300 dark:border-gray-700 p-4 sm:h-[calc(100vh-100px)]">
        <MiniCalendar />

        {/* Events Container */}
        <div className="mt-6 h-[calc(100%-320px)] overflow-y-auto scrollbar-none">
          <h3 className="text-sm mb-4 text-gray-800 dark:text-gray-300">
            Upcoming Events
          </h3>

          {isLoading ? (
            <SimpleLoader />
          ) : groupedEvents.length ? (
            <div className="pr-2">
              {groupedEvents.map(([monthYear, events]) => (
                <div key={monthYear} className="mb-6">
                  {/* Month Header */}
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    {monthYear}
                  </div>

                  {/* Events List */}
                  <div className="space-y-3">
                    {events.map((event) => (
                      <div
                        key={event._id}
                        className="bg-white dark:bg-gray-900 p-4 border border-primary_one rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 ease-out"
                      >
                        <div className="flex flex-col">
                          <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 truncate mb-1">
                            {event.eventName}
                          </h4>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(event.eventDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2.5 py-1 rounded-full">
                              {event.dayLeft}{" "}
                              {event.dayLeft === 1 ? "day" : "days"} left
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No upcoming events found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutWithCalendar;
