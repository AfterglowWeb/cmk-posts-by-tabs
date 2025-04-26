import { useState, useEffect } from 'react';
import { initializeMap } from './map/map';

const pluginSettings = window.postsByTabsSettings || {
  googleMapsApiKey: ''
};

export function useGoogleMapsLoader(config, places, elementRef) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!pluginSettings.googleMapsApiKey || !elementRef.current) {
      setError("Missing API key or map element");
      return;
    }

    if (window.google && window.google.maps) {
      initMapInstance();
      return;
    }


    window.initMap = initMapInstance;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${pluginSettings.googleMapsApiKey}&loading=async&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      setError("Failed to load Google Maps API");
    };

    document.head.appendChild(script);

    return () => {
      if (window.initMap) {
        delete window.initMap;
      }
      document.head.removeChild(script);
    };
  }, [elementRef]);


  function initMapInstance() {
    if (!elementRef.current) return;
    
    try {
      const { map, markers } = initializeMap(config, places, elementRef.current);
      setMapInstance(map);
      setMarkers(markers);
      setMapLoaded(true);

    } catch (err) {
      setError(`Map initialization error: ${err.message}`);
    }
  }

  return { mapLoaded, mapInstance, markers, error };
}