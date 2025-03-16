import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useContentUpdates } from "../hooks/useContentUpdates";

// Helper function to format topic names for display
const formatTopicName = (topic: string): string => {
  return topic
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </div>
  </div>
);

const DocViewer = () => {
  const { docName } = useParams<{ docName: string }>();
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toc, setToc] = useState<Array<{ id: string; title: string }>>([]);
  const { theme } = useTheme();
  const { shouldRefresh, resetRefresh } = useContentUpdates();

  const fetchContent = async () => {
    if (!docName) return;

    try {
      console.log('Fetching content for:', docName);
      const response = await fetch(`http://localhost:8080/api/docs?name=${docName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${docName} documentation`);
      }
      const data = await response.json();
      
      // Extract headings for table of contents
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.html, "text/html");
      const headings = Array.from(doc.querySelectorAll("h2, h3"));
      
      setHtml(data.html);
      setToc(
        headings.map((heading) => ({
          id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
          title: heading.textContent || "",
        }))
      );
      setError(null);
      console.log('Content updated successfully');
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(`Failed to load ${formatTopicName(docName)} documentation.`);
    } finally {
      setLoading(false);
      resetRefresh();
    }
  };

  // Fetch content when docName changes
  useEffect(() => {
    setLoading(true);
    fetchContent();
  }, [docName]);

  // Refresh content when updates are detected
  useEffect(() => {
    if (shouldRefresh) {
      console.log('Refresh triggered - fetching new content');
      fetchContent();
    }
  }, [shouldRefresh]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className={`max-w-7xl mx-auto p-8 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`transition-colors ${
                theme === 'dark'
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Home
            </Link>
            <svg
              className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}
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
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              {docName ? formatTopicName(docName) : "Documentation"}
            </span>
          </div>
        </nav>

        {/* Header */}
        <header className={`mb-8 pb-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {docName ? formatTopicName(docName) : "Documentation"}
          </h1>
        </header>

        <div className="flex gap-8">
          {/* Table of Contents */}
          {!loading && !error && toc.length > 0 && (
            <aside className="w-64 flex-shrink-0">
              <div className={`sticky top-4 p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <h2 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Table of Contents
                </h2>
                <nav className="space-y-2">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block transition-colors text-sm ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-blue-400'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Content */}
          <div className={`prose max-w-none flex-1 ${
            theme === 'dark' 
              ? 'prose-invert prose-pre:bg-gray-800 prose-pre:text-gray-100' 
              : 'prose-gray prose-pre:bg-gray-50'
          }`}>
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className={`p-4 rounded-lg ${
                theme === 'dark'
                  ? 'bg-red-900/50 text-red-200 border border-red-800'
                  : 'bg-red-50 text-red-500 border border-red-200'
              }`}>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            ) : (
              <div className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocViewer;