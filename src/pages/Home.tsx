import { Icon } from "@iconify/react";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Dashboard Home
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Welcome to your dashboard. Here's an overview of your activities.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-blue-100 dark:bg-blue-900 overflow-hidden shadow rounded-lg transition-colors duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon
                  icon="mdi:chart-line"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    $24,000
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-green-100 dark:bg-green-900 overflow-hidden shadow rounded-lg transition-colors duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon
                  icon="mdi:account-group"
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    New Clients
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    12
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 overflow-hidden shadow rounded-lg transition-colors duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon
                  icon="mdi:clipboard-text-clock"
                  className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    18
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
