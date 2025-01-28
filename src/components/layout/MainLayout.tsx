import Sidebar from "./Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 ">
      <Sidebar />
      <div className="flex-1 flex flex-col  lg:border rounded-3xl dark:border-primary_one shadow-md shadow-gray-300 dark:shadow-gray-800 sm:m-5 overflow-hidden">
        <main className="flex-1  p-0 md:p-4 lg:p-8 bg-gray-50 dark:bg-gray-900 ">
          {children}
        </main>
      </div>
    </div>
  );
}
