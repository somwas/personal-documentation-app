import { useState, useEffect } from 'react';

export const useContentUpdates = () => {
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  useEffect(() => {
    // Function to check for updates
    const checkForUpdates = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/last-update');
        if (!response.ok) {
          console.error('Failed to check for updates:', response.status);
          return;
        }
        
        const data = await response.json();
        const newUpdateTime = data.lastUpdate;
        
        console.log('Checking for updates - Current:', lastUpdateTime, 'New:', newUpdateTime);
        
        // If we have a previous update time and it's different, trigger a refresh
        if (lastUpdateTime && new Date(newUpdateTime).getTime() > new Date(lastUpdateTime).getTime()) {
          console.log('Content update detected - refreshing...');
          setShouldRefresh(true);
        }
        
        setLastUpdateTime(newUpdateTime);
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    // Check immediately on mount
    checkForUpdates();

    // Set up polling every 5 seconds
    const interval = setInterval(checkForUpdates, 5000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [lastUpdateTime]);

  const resetRefresh = () => {
    setShouldRefresh(false);
  };

  return { shouldRefresh, resetRefresh };
};