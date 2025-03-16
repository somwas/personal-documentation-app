import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface HomeProps {
  topics: string[];
}

const Home: React.FC<HomeProps> = ({ topics }) => {
  const { theme } = useTheme();

  // Helper function to format topic names for display
  const formatTopicName = (topic: string): string => {
    return topic
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome to Personal Docs
          </h1>
          <p className={`text-xl ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your centralized knowledge base for all documentation needs
          </p>
        </div>

        {/* Featured Documents */}
        <div className="mb-16">
          <h2 className={`text-2xl font-semibold mb-8 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Featured Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.slice(0, 6).map((topic) => (
              <Link
                key={topic}
                to={`/docs/${topic}`}
                className={`group p-6 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
              >
                <h3 className={`text-lg font-medium mb-2 group-hover:text-blue-${theme === 'dark' ? '400' : '600'}`}>
                  {formatTopicName(topic)}
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Click to view the complete documentation
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className={`text-2xl font-semibold mb-8 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Quick Links
          </h2>
          <div className={`rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {topics.slice(0, 8).map((topic) => (
                <Link
                  key={topic}
                  to={`/docs/${topic}`}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span>{formatTopicName(topic)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className={`rounded-lg p-8 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-900 to-blue-800'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'
        }`}>
          <h2 className={`text-2xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Getting Started
          </h2>
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            New to the documentation? Start with these essential resources:
          </p>
          <div className="space-y-4">
            <Link
              to="/docs/new-joiner-guide"
              className={`flex items-center p-4 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-800/50 hover:bg-blue-700/50 text-blue-100'
                  : 'bg-white/50 hover:bg-white text-blue-900'
              }`}
            >
              <div className="flex-shrink-0 mr-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">New Joiner Guide</h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                }`}>
                  Essential information for new team members
                </p>
              </div>
            </Link>
            <Link
              to="/docs/quick-start"
              className={`flex items-center p-4 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-800/50 hover:bg-blue-700/50 text-blue-100'
                  : 'bg-white/50 hover:bg-white text-blue-900'
              }`}
            >
              <div className="flex-shrink-0 mr-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Quick Start Guide</h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                }`}>
                  Get up and running quickly with our platform
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 