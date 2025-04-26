import React, { createContext, useContext, useEffect, useState } from '@wordpress/element';

export const GoogleMapsContext = createContext(null);

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

export const GoogleMapsProvider = ({ apiKey, children, libraries = ['places'], version = 'weekly' }) => {
  const [googleMaps, setGoogleMaps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setGoogleMaps(window.google.maps);
      setLoading(false);
      return;
    }

    const callbackName = `googleMapsApiCallback_${Date.now()}`;

    const loadGoogleMapsApi = new Promise((resolve, reject) => {

      window[callbackName] = () => {
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Google Maps API failed to load'));
        }
        
        delete window[callbackName];
      };

      const librariesParam = libraries.join(',');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${librariesParam}&callback=${callbackName}&v=${version}`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        reject(new Error('Google Maps API script failed to load'));
        delete window[callbackName];
      };

      document.head.appendChild(script);
    });

    loadGoogleMapsApi
      .then((maps) => {
        console.log('Google Maps API loaded successfully');
        setGoogleMaps(maps);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading Google Maps API:', err);
        setError(err);
        setLoading(false);
      });

    return () => {
      delete window[callbackName];
    };
  }, [apiKey, libraries.join(','), version]);

  const contextValue = {
    googleMaps,
    loading,
    error,
    isLoaded: !!googleMaps && !loading,
  };

  if (error) {
    console.error('Google Maps API error:', error);
    return (
      <div className="google-maps-error">
        Failed to load Google Maps. Please check your API key and try again.
      </div>
    );
  }

  return (
    <GoogleMapsContext.Provider value={contextValue}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const APIProvider = GoogleMapsProvider;