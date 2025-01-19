import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTask.trim(), completed: false },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.length - pendingTasks;

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Todo App
      </h1>

      <div className="flex justify-between mb-4 text-sm text-gray-600 dark:text-gray-300">
        <span>Pending tasks: {pendingTasks}</span>
        <span>Completed tasks: {completedTasks}</span>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Add a new task"
        />
        <button
          onClick={addTask}
          className="p-2 bg-darker_green text-white rounded-r-md hover:bg-blue-600 focus:outline-none dark:bg-darker_green dark:hover:bg-dark_green"
        >
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex justify-center items-center h-32 text-gray-400 dark:text-gray-600">
          <Icon icon="mdi:plus-circle-outline" width={48} />
        </div>
      ) : (
        <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center p-2 border border-gray-200 rounded-md dark:border-gray-600"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 mr-2 flex items-center justify-center border rounded-md ${
                  task.completed
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 dark:border-gray-500"
                }`}
              >
                {task.completed && (
                  <Icon icon="mdi:check" width={16} color="white" />
                )}
              </button>
              <span
                className={`flex-grow ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {task.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
