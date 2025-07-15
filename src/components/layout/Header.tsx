import React from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

interface HeaderProps {
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({}) => {
  const { isDarkMode, toggleDarkMode } = useAppStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const handleThemeToggle = () => {
    toggleDarkMode();
    toast.success(`Switched to ${!isDarkMode ? "dark" : "light"} mode`);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Gemini Chat
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleThemeToggle}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user?.countryCode}
                {user?.phone}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile user info */}
        <div className="sm:hidden pb-3">
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.countryCode}
              {user?.phone}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
