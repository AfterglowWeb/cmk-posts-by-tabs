
import React, { useState, useRef, useEffect } from '@wordpress/element';
import { useGoogleMapsLoader } from '../utils/useGoogleMapsLoader';

export default function EventsMap(props) {
    const mapRef = useRef(null);
    const { posts, tab, config } = props;
    
    if (!posts) {
        return null;
    }
    
    const { zoom } = tab;
    const places = groupEventsByPlaces(posts);
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

function groupEventsByPlaces(posts) {
    if (!posts) {
        return null;
    }
    
    const eventsByPlaces = [];
    const placeMap = new Map();
    
    posts.forEach(post => {
        if (!post.acf?.lieu) {
            return;
        }
        
        const lieu = post.acf.lieu;
        
        if (!lieu.id) {
            console.warn('Place is missing ID:', lieu);
            return;
        }
        
        if (placeMap.has(lieu.id)) {
            placeMap.get(lieu.id).events.push(post);
        } else {
            const eventsByPlace = {
                place: lieu,
                events: [post]
            };
            eventsByPlaces.push(eventsByPlace);
            placeMap.set(lieu.id, eventsByPlace);
        }
    });
    
    return eventsByPlaces;
}