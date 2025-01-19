import MiniCalendar from "../components/GoalsAddons/MiniCalendar";
import TodoApp from "../components/GoalsAddons/Todo";

const Page2 = () => {
  return (
    <div className="flex justify-between flex-col sm:flex-row h-full dark:bg-gray-900">
      {/* Main TodoApp Section */}
      <div className="w-full sm:w-[78%] h-full">
        <div className="h-full overflow-y-auto scrollbar-none">
          <TodoApp />
        </div>
      </div>

      {/* MiniCalendar Section - hidden on small screens */}
      <div className="w-full sm:w-[20%] sm:block hidden sm:border-l border-gray-300 dark:border-gray-700 p-4 sm:h-auto h-full">
        <MiniCalendar />
      </div>
    </div>
  );
};

export default Page2;
