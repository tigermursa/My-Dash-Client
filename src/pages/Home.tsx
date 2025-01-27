import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAuth from "../hooks/useAuth";
import { taskAPI } from "../lib/planApi";
import { AllTasks } from "../types/PlanTypes";
import { Icon } from "@iconify/react";

// Updated color scheme based on your tailwind config
const COLORS = ["#3cbc78", "#00bfff", "#ffa0b4", "#00bfff"];

const Home = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch all tasks for different categories
  const results = useQueries({
    queries: ["todo", "week", "month", "year"].map((category) => ({
      queryKey: ["tasks", category, user?._id],
      queryFn: () => taskAPI.getTasks(user?._id || ""),
      enabled: !!user?._id,
      select: (data: AllTasks[]) =>
        data.filter((task) => task.title === category),
    })),
  });

  // Process data for charts
  const processData = () => {
    const categories = ["todo", "week", "month", "year"];
    const categoryData = categories.map((category, index) => {
      const tasks = results[index].data || [];
      return {
        name: category.toUpperCase(),
        total: tasks.length,
        completed: tasks.filter((t) => t.isCompleted).length,
        pending: tasks.filter((t) => !t.isCompleted).length,
        important: tasks.filter((t) => t.important).length,
        fill: COLORS[index % COLORS.length],
      };
    });

    const totalCompleted = categoryData.reduce(
      (sum, curr) => sum + curr.completed,
      0
    );
    const totalPending = categoryData.reduce(
      (sum, curr) => sum + curr.pending,
      0
    );
    const totalImportant = categoryData.reduce(
      (sum, curr) => sum + curr.important,
      0
    );

    return {
      categoryData,
      totals: {
        completed: totalCompleted,
        pending: totalPending,
        important: totalImportant,
      },
    };
  };

  const { categoryData, totals } = processData();
  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  if (isLoading)
    return (
      <div className="text-center p-8 text-primary_darker">
        Loading statistics...
      </div>
    );
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">Error loading data</div>
    );

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-primary_light">
        <Icon
          icon="mdi:chart-box"
          className="inline mr-2 text-primary_darker"
        />
        <span className="bg-gradient-to-r from-primary_dark to-primary_light bg-clip-text text-transparent">
          Productivity Dashboard
        </span>
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-primary_darker/10 dark:bg-primary_darker/30 p-4 rounded-lg border border-primary_darker/20">
          <h3 className="text-primary_darker dark:text-primary_light">
            <Icon icon="mdi:check-circle" className="inline mr-2" />
            Completed Tasks
          </h3>
          <p className="text-2xl font-bold text-primary_darker dark:text-primary_light">
            {totals.completed}
          </p>
        </div>
        <div className="bg-primary_dark/10 dark:bg-red-700 p-4 rounded-lg border border-primary_dark/20">
          <h3 className="text-primary_dark dark:text-gray-50">
            <Icon icon="mdi:alert-circle" className="inline mr-2" />
            Pending Tasks
          </h3>
          <p className="text-2xl font-bold text-primary_dark dark:text-gray-50">
            {totals.pending}
          </p>
        </div>
        <div className="bg-primary_light/10 dark:bg-primary_light/30 p-4 rounded-lg border border-primary_light/20">
          <h3 className="text-primary_light dark:text-yellow-500">
            <Icon icon="mdi:star" className="inline mr-2" />
            Important Tasks
          </h3>
          <p className="text-2xl font-bold text-primary_light dark:text-yellow-500">
            {totals.important}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-primary_darker/20">
          <h2 className="text-xl font-semibold mb-4 dark:text-primary_light">
            <Icon
              icon="mdi:chart-pie"
              className="inline mr-2 text-primary_dark"
            />
            Task Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#49e7a5",
                  border: "1px solid #3cbc78",
                  borderRadius: "8px",
                  color: "#49e7a5",
                }}
              />
              <Legend
                wrapperStyle={{ color: "#3cbc78" }}
                formatter={(value) => (
                  <span className="dark:text-primary_light">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-primary_dark/20">
          <h2 className="text-xl font-semibold mb-4 dark:text-primary_light">
            <Icon
              icon="mdi:chart-bar"
              className="inline mr-2 text-primary_darker"
            />
            Progress Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3cbc7850" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#3cbc78" }}
                stroke="#3cbc78"
              />
              <YAxis tick={{ fill: "#3cbc78" }} stroke="#3cbc78" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e232f",
                  border: "1px solid #3cbc78",
                  borderRadius: "8px",
                  color: "#49e7a5",
                }}
              />
              <Legend
                wrapperStyle={{ color: "#3cbc78" }}
                formatter={(value) => (
                  <span className="dark:text-primary_light">{value}</span>
                )}
              />
              <Bar
                dataKey="completed"
                fill="#3cbc78"
                name="Completed Tasks"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pending"
                fill="#49e7a5"
                name="Pending Tasks"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {categoryData.map((category, index) => (
          <div
            key={category.name}
            className="p-4 rounded-lg shadow-lg transition-all hover:scale-[1.02] cursor-pointer group"
            style={{
              backgroundColor: `${COLORS[index]}10`,
              border: `1px solid ${COLORS[index]}30`,
            }}
            onClick={() => setSelectedCategory(category.name)}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: COLORS[index] }}
            >
              {category.name} PLAN
            </h3>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total: {category.total}
                </p>
                <p className="text-sm text-primary_darker dark:text-primary_light">
                  Completed: {category.completed}
                </p>
                <p className="text-sm text-primary_dark dark:text-red-600">
                  Pending: {category.pending}
                </p>
              </div>
              <Icon
                icon={
                  selectedCategory === category.name
                    ? "mdi:chart-box-outline"
                    : "mdi:chart-box"
                }
                className="text-3xl opacity-50"
                style={{ color: COLORS[index] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
