import { useState, useEffect } from 'react';

export const useContentUpdates = () => {
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  useEffect(() => {
    // Function to check for updates
    const checkForUpdates = async () => {
      try {
        console.log('Polling for updates...');
        const response = await fetch('http://localhost:8080/api/last-update');
        if (!response.ok) {
          console.error('Failed to check for updates:', response.status);
          return;
        }
        
        const data = await response.json();
        const newUpdateTime = data.lastUpdate;
        
        console.log('Poll result - Current:', new Date(lastUpdateTime || '').toISOString(), 'New:', new Date(newUpdateTime).toISOString());
        
        // If this is our first check or we have a newer timestamp
        if (!lastUpdateTime || (newUpdateTime && new Date(newUpdateTime) > new Date(lastUpdateTime))) {
          console.log('Content update detected - triggering refresh');
          setShouldRefresh(true);
          setLastUpdateTime(newUpdateTime);
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    // Check immediately on mount
    checkForUpdates();

    // Poll every 2 seconds instead of 5
    const interval = setInterval(checkForUpdates, 2000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []); // Remove lastUpdateTime dependency to prevent unnecessary effect triggers

  const resetRefresh = () => {
    console.log('Resetting refresh state');
    setShouldRefresh(false);
  };

  return { shouldRefresh, resetRefresh };
}; 