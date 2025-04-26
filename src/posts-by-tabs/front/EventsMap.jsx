
import React, { useState, useRef, useEffect } from '@wordpress/element';
import { useGoogleMapsLoader } from '../utils/useGoogleMapsLoader';
import groupEventsByPlaces from '../utils/groupEventsByPlaces';

export default function EventsMap(props) {
    const mapRef = useRef(null);
    const { posts, tab, attributes, config } = props;
    
    if (!posts) {
        return null;
    }
    
    const { zoom } = tab;
    const places = groupEventsByPlaces(attributes, posts);
    const { mapLoaded, mapInstance, markers, error } = useGoogleMapsLoader(config, mapRef, places);
    
    useEffect(() => {
    if (mapLoaded && mapInstance && markers) {
        //centerMap(mapInstance, markers);
    }
    }, [mapLoaded, mapInstance, markers]);

    const mapHeight = '400px';
    const mapWidth = '100%';

    return (
        <div className="w-full z-10 overflow-hidden rounded-none">
            {error && <div className="map-error">{error}</div>}
            <div 
                ref={mapRef} 
                style={{ height: mapHeight, width: mapWidth }}
                data-zoom={zoom || 11}
            />
        </div>
    );
}