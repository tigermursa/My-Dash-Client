import Sidebar from "./Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 ">
      <Sidebar />
      <div className="flex-1 flex flex-col  lg:border rounded-3xl dark:border-primary_one shadow-md shadow-gray-300 dark:shadow-gray-800  overflow-x-scroll ">
        <main className="flex-1  p-0 lg:p-3 2xl:p-8 bg-gray-50 dark:bg-gray-900 ">
          {children}
        </main>
      </div>
    </div>
  );
}
