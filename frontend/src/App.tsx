import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import DocViewer from "./components/DocViewer";
import Home from "./components/Home";
import "./App.css";

// Wrapper component to handle layout
const Layout = ({ topics }: { topics: string[] }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar - always visible */}
      <Sidebar topics={topics} />

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home topics={topics} />} />
          <Route path="/docs/:docName" element={<DocViewer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available documentation topics
    fetch("http://localhost:8080/api/topics")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch topics");
        }
        return response.json();
      })
      .then((data) => {
        setTopics(data.topics);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load documentation topics.");
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl dark:text-white dark:bg-gray-900">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-xl text-red-500 dark:bg-gray-900">{error}</div>;
  }

  return (
    <ThemeProvider>
      <Router>
        <Layout topics={topics} />
      </Router>
    </ThemeProvider>
  );
}

export default App;