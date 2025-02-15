import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import useAuth from "../../hooks/useAuth";
import { taskAPI } from "../../lib/planApi";
import { useState, useMemo } from "react";
import { AllTasks } from "../../types/PlanTypes";
import { toast } from "react-toastify";
import SimpleLoader from "../Ui/Loader/SimpleLoader";

interface TaskPlannerProps {
  title: string;
  storageKey: "todo" | "week" | "month" | "year";
}

// Type for the context returned from onMutate
interface OptimisticUpdateContext {
  previousTasks: AllTasks[] | undefined;
}

const TaskPlanner: React.FC<TaskPlannerProps> = ({ title, storageKey }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState("");

  // Use userId or an empty string if not available
  const userId = user?._id || "";

  // Fetch tasks from API
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery<AllTasks[]>({
    queryKey: ["tasks", storageKey, userId],
    queryFn: () => taskAPI.getTasks(userId),
    enabled: !!userId,
    select: (data) => data.filter((task) => task.title === storageKey),
  });

  // Create task mutation (no optimistic update here)
  const createMutation = useMutation<AllTasks, Error, string>({
    mutationFn: (text: string) =>
      taskAPI.createTask({
        userID: userId,
        task: {
          text,
          title: storageKey,
          important: false,
          isCompleted: false,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", storageKey, userId],
      });
      toast.success("Task created successfully!");
    },
    onError: (error: Error) => alert(error.message),
  });

  // Toggle task completion with optimistic update
  const toggleMutation = useMutation<
    AllTasks,
    Error,
    string,
    OptimisticUpdateContext
  >({
    mutationFn: (taskId: string) =>
      taskAPI.toggleComplete({
        userID: userId,
        taskId,
      }),
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks", storageKey, userId],
      });
      const previousTasks = queryClient.getQueryData<AllTasks[]>([
        "tasks",
        storageKey,
        userId,
      ]);
      queryClient.setQueryData<AllTasks[]>(
        ["tasks", storageKey, userId],
        (old) =>
          old?.map((task) =>
            task.id === taskId
              ? { ...task, isCompleted: !task.isCompleted }
              : task
          ) || []
      );
      return { previousTasks };
    },
    onError: (error, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<AllTasks[]>(
          ["tasks", storageKey, userId],
          context.previousTasks
        );
      }
      toast.error("Error updating task!");
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", storageKey, userId],
      });
    },
  });

  // Toggle important mutation with optimistic update
  const toggleImportantMutation = useMutation<
    AllTasks,
    Error,
    string,
    OptimisticUpdateContext
  >({
    mutationFn: (taskId: string) =>
      taskAPI.toggleImportant({
        userID: userId,
        taskId,
      }),
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks", storageKey, userId],
      });
      const previousTasks = queryClient.getQueryData<AllTasks[]>([
        "tasks",
        storageKey,
        userId,
      ]);
      queryClient.setQueryData<AllTasks[]>(
        ["tasks", storageKey, userId],
        (old) =>
          old?.map((task) =>
            task.id === taskId ? { ...task, important: !task.important } : task
          ) || []
      );
      return { previousTasks };
    },
    onError: (error, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<AllTasks[]>(
          ["tasks", storageKey, userId],
          context.previousTasks
        );
      }
      console.log(error);
      toast.error("Error updating task!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", storageKey, userId],
      });
    },
  });

  // Delete task mutation with optimistic update
  const deleteMutation = useMutation<
    void,
    Error,
    string,
    OptimisticUpdateContext
  >({
    mutationFn: (taskId: string) =>
      taskAPI.deleteTask({
        userID: userId,
        taskId,
      }),
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks", storageKey, userId],
      });
      const previousTasks = queryClient.getQueryData<AllTasks[]>([
        "tasks",
        storageKey,
        userId,
      ]);
      queryClient.setQueryData<AllTasks[]>(
        ["tasks", storageKey, userId],
        (old) => old?.filter((task) => task.id !== taskId) || []
      );
      return { previousTasks };
    },
    onError: (error, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<AllTasks[]>(
          ["tasks", storageKey, userId],
          context.previousTasks
        );
      }
      console.log(error);
      toast.error("Error deleting task!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", storageKey, userId],
      });
    },
    onSuccess: () => {
      toast.success("Task deleted successfully!");
    },
  });

  const addTask = () => {
    if (newTask.trim()) {
      createMutation.mutate(newTask.trim());
      setNewTask("");
    }
  };

  // Using useMemo to memoize computed values
  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.isCompleted).length,
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.length - pendingTasks,
    [tasks, pendingTasks]
  );

  if (isLoading)
    return (
      <div className="p-4 text-center">
        <SimpleLoader />
      </div>
    );
  if (isError)
    return (
      <div className="p-4 text-center text-red-500">Error loading tasks</div>
    );

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        {title} Plan
      </h1>

      <div className="flex justify-between mb-4 text-sm text-gray-600 dark:text-gray-300">
        <span className="flex gap-1 text-lg items-center">
          <Icon
            icon="mdi:receipt-text-pending"
            className="text-gray-800 dark:text-gray-100"
          />{" "}
          Pending: <span>{pendingTasks}</span>
        </span>

        <span className="flex gap-1 text-lg items-center">
          <Icon
            icon="fluent-mdl2:completed-solid"
            className="text-green-800 dark:text-green-400"
          />{" "}
          Completed: <span>{completedTasks}</span>
        </span>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Add a new task"
          disabled={createMutation.isPending}
        />
        <button
          onClick={addTask}
          disabled={createMutation.isPending}
          className="p-2 bg-primary_one text-white rounded-r-md hover:bg-blue-600 focus:outline-none dark:bg-primary_one dark:hover:bg-primary_one disabled:opacity-50 transition-colors"
        >
          {createMutation.isPending ? "Adding..." : "Add Task"}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-600">
          <Icon icon="mdi:clipboard-text-outline" width={48} />
          <p className="mt-2">No tasks found</p>
        </div>
      ) : (
        <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center p-3 bg-white dark:bg-gray-800 border-2 rounded-md hover:shadow-md transition-shadow ${
                task.important
                  ? "border-yellow-400 dark:border-yellow-600"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* Complete button */}
              <button
                onClick={() => toggleMutation.mutate(task.id)}
                className={`w-6 h-6 mr-3 flex items-center justify-center border rounded-md transition-colors ${
                  task.isCompleted
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 dark:border-gray-500 hover:border-green-500"
                }`}
                disabled={createMutation.isPending}
              >
                {task.isCompleted && (
                  <Icon icon="mdi:check" width={16} className="text-white" />
                )}
              </button>

              <span
                className={`flex-grow ${
                  task.isCompleted
                    ? "line-through text-gray-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {task.text}
              </span>

              {/* Toggle important button */}
              <button
                onClick={() => toggleImportantMutation.mutate(task.id)}
                className="text-yellow-400 hover:text-yellow-500 ml-2 p-1"
                disabled={createMutation.isPending}
              >
                <Icon
                  icon={task.important ? "mdi:star" : "mdi:star-outline"}
                  width={20}
                />
              </button>

              {/* Delete button */}
              <button
                onClick={() => deleteMutation.mutate(task.id)}
                className="text-red-500 hover:text-red-700 ml-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                disabled={createMutation.isPending}
              >
                <Icon icon="mdi:delete-outline" width={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskPlanner;
