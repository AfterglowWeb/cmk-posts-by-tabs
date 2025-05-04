import React, { createContext, useContext, useEffect, useState } from '@wordpress/element';

export const GoogleMapsContext = createContext(null);

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

const isApiLoaded = () => {
  return typeof window !== 'undefined' && window.google && window.google.maps;
};

export const GoogleMapsProvider = ({ apiKey, children, libraries = ['places'], version = 'weekly' }) => {
  const [googleMaps, setGoogleMaps] = useState(isApiLoaded() ? window.google.maps : null);
  const [loading, setLoading] = useState(!isApiLoaded());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isApiLoaded()) {
      setGoogleMaps(window.google.maps);
      setLoading(false);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      console.log('Google Maps API is already being loaded by another script');
      
      const checkGoogleMaps = setInterval(() => {
        if (isApiLoaded()) {
          setGoogleMaps(window.google.maps);
          setLoading(false);
          clearInterval(checkGoogleMaps);
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkGoogleMaps);
        if (!isApiLoaded()) {
          setError(new Error('Google Maps API failed to load within timeout'));
          setLoading(false);
        }
      }, 10000);
      
      return () => {
        clearInterval(checkGoogleMaps);
      };
    }

    const script = document.createElement('script');
    
    if (!apiKey) {
      setError(new Error('Google Maps API key is required'));
      setLoading(false);
      return;
    }
    
    const librariesParam = libraries.join(',');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${librariesParam}`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      setError(new Error('Google Maps API script failed to load'));
      setLoading(false);
    };
    
    script.onload = () => {
      if (isApiLoaded()) {
        setGoogleMaps(window.google.maps);
        setLoading(false);
      } else {
        setError(new Error('Google Maps API loaded but not available'));
        setLoading(false);
      }
    };

    document.head.appendChild(script);

    return () => {};
  }, [apiKey, libraries.join(','), version]);

  const contextValue = {
    googleMaps,
    loading,
    error,
    isLoaded: !!googleMaps && !loading,
  };

  return (
    <GoogleMapsContext.Provider value={contextValue}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const APIProvider = GoogleMapsProvider;