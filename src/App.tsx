import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useAppStore } from "./store/appStore";
import { AuthPage } from "./components/auth/AuthPage";
import { Dashboard } from "./components/dashboard/Dashboard";

function App() {
  const { user } = useAuthStore();
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    // Apply theme on initial load and changes
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Apply theme on component mount
  useEffect(() => {
    const stored = localStorage.getItem("app-storage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const darkMode = parsed.state?.isDarkMode ?? false;
        if (darkMode) {
          document.documentElement.classList.add("dark");
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {user?.isAuthenticated ? <Dashboard /> : <AuthPage />}
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDarkMode ? "#374151" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
          },
        }}
      />
    </>
  );
}

export default App;