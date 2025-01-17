import ThemeToggle from "../ThemeToggle";
import Sidebar from "./Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden border rounded-3xl border-dark_green m-5">
        <header className="bg-gray-100 dark:bg-gray-900 border hidden">
          <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-end items-center">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-hidden p-4 lg:p-8 bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
