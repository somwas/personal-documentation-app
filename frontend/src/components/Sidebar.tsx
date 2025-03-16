import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Helper function to format topic names for display
const formatTopicName = (topic: string): string => {
  return topic
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface SidebarProps {
  topics: string[];
}

const MAX_RECENT_ITEMS = 5;

const Sidebar: React.FC<SidebarProps> = ({ topics }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Update recently viewed docs
  useEffect(() => {
    const docName = location.pathname.split("/docs/")[1];
    if (docName) {
      setRecentlyViewed((prev) => {
        const newRecent = [docName, ...prev.filter((item) => item !== docName)];
        return newRecent.slice(0, MAX_RECENT_ITEMS);
      });
    }
  }, [location]);

  // Filter topics based on search query
  const filteredTopics = topics.filter((topic) =>
    formatTopicName(topic).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-64 flex flex-col transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white border-r border-gray-700' 
        : 'bg-white text-gray-900 border-r border-gray-200'
    }`}>
      {/* App Title */}
      <div className={`px-6 py-4 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      } flex items-center justify-between`}>
        <NavLink 
          to="/" 
          className={`text-xl font-bold ${
            theme === 'dark' 
              ? 'text-white hover:text-blue-400' 
              : 'text-gray-900 hover:text-blue-600'
          } transition-colors`}
        >
          Personal Docs
        </NavLink>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-md transition-colors ${
            theme === 'dark'
              ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Search Box */}
      <div className="px-4 py-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search docs..."
            className={`w-full rounded-md py-2 px-4 pl-10 text-sm transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-200 focus:ring-blue-500 placeholder-gray-400'
                : 'bg-gray-100 text-gray-900 focus:ring-blue-500 placeholder-gray-500'
            } focus:outline-none focus:ring-2`}
          />
          <svg
            className={`absolute left-3 top-2.5 h-4 w-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute right-3 top-2.5 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Home Link */}
        <div className="mb-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-6 py-2 text-sm transition-colors ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </NavLink>
        </div>

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div className="mb-6">
            <h2 className={`px-6 text-xs font-semibold uppercase tracking-wider mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Recently Viewed
            </h2>
            <ul>
              {recentlyViewed.map((topic) => (
                <li key={`recent-${topic}`}>
                  <NavLink
                    to={`/docs/${topic}`}
                    className={({ isActive }) =>
                      `flex items-center px-6 py-2 text-sm transition-colors ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-700'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <span>{formatTopicName(topic)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* All Documents */}
        <div>
          <h2 className={`px-6 text-xs font-semibold uppercase tracking-wider mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            All Documents
          </h2>
          <ul>
            {filteredTopics.map((topic) => (
              <li key={topic}>
                <NavLink
                  to={`/docs/${topic}`}
                  className={({ isActive }) =>
                    `flex items-center px-6 py-2 text-sm transition-colors ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-700'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <span>{formatTopicName(topic)}</span>
                </NavLink>
              </li>
            ))}
            {searchQuery && filteredTopics.length === 0 && (
              <li className={`px-6 py-3 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No documents found
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className={`px-6 py-4 border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
          Personal Documentation v1.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;