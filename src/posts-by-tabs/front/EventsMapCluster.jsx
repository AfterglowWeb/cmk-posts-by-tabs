import React, { useState, useEffect, useRef } from '@wordpress/element';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { GridAlgorithm } from '@googlemaps/markerclusterer';
import groupEventsByPlaces from '../utils/groupEventsByPlaces';

const RED_MAP_STYLE = [
  {"featureType":"administrative","stylers":[{"color":"#ffffff"},{"visibility":"simplified"},{"weight":1}]},
  {"featureType":"landscape","stylers":[{"color":"#f56060"}]},
  {"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"simplified"}]},
  {"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#f56060"}]},
  {"featureType":"poi","stylers":[{"color":"#d13d40"},{"visibility":"simplified"}]},
  {"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#d33b3b"}]},
  {"featureType":"poi","elementType":"labels.text","stylers":[{"color":"#ffffff"}]},
  {"featureType":"poi.park","stylers":[{"color":"#d15254"},{"visibility":"simplified"}]},
  {"featureType":"poi.park","elementType":"labels.text","stylers":[{"visibility":"off"}]},
  {"featureType":"road","stylers":[{"color":"#eb4553"}]},
  {"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},
  {"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},
  {"featureType":"road.local","stylers":[{"visibility":"off"}]},
  {"featureType":"transit","stylers":[{"color":"#e7e7e7"}]},
  {"featureType":"transit","elementType":"labels","stylers":[{"color":"#7a7a7a"},{"visibility":"simplified"}]},
  {"featureType":"water","stylers":[{"color":"#afc8d2"}]}
];

import mapRedStyle from '../styles/mapRedStyle.json';
import mapGreenStyle from '../styles/mapGreenStyle.json';

const DEFAULT_MARKER_SVG = `data:image/svg+xml;utf8,<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve"><path id="Tracé_1056" style="opacity:0.7;fill:%23091219;" d="M15.8,1.3C10,1.3,5.3,6,5.3,11.8l0,0 c0,7.5,10.5,19.5,10.5,19.5s10.5-12,10.5-19.5C26.3,6,21.6,1.3,15.8,1.3L15.8,1.3z"/></svg>`;

const postsByTabsSettings = window.postsByTabsSettings?.options || {
  defaultLatitude: 48.8566,
  defaultLongitude: 2.3522
};
function createInfoWindowContent(placeData) {
  const { place, events } = placeData;
  
  let content = `<div class="info-window-content">`;
  content += `<h3>${place.title?.rendered || place.title || 'Unnamed location'}</h3>`;
  
  if (place.acf.address) {
    content += `<p>${place.acf.address}</p>`;
  }
  
  if (events && events.length > 0) {
    content += `<h4>Events (${events.length})</h4>`;
    content += `<ul>`;
    events.forEach(event => {
      content += `<li>
        <a href="${event.link || '#'}" target="_blank">
          ${event.title?.rendered || event.title || 'Unnamed event'}
        </a>
      </li>`;
    });
    content += `</ul>`;
  }
  
  content += `</div>`;
  return content;
}

export default function EventsMapCluster(props) {
  const { attributes, posts, tab } = props;
  const [eventByPlaces, setEventByPlaces] = useState([]);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const clustererRef = useRef(null);

  const mapOptions = tab?.map || {};
  const mapStyle = mapOptions.mapStyle === 'green' ? mapGreenStyle : mapRedStyle;
  
  const markerIcon = mapOptions.markerIcon || DEFAULT_MARKER_SVG;
  
  const defaultLatitude = parseFloat(mapOptions.defaultLatitudeitude || tab?.options?.map?.center?.lat || postsByTabsSettings.defaultLatitude);
  const defaultLongitude = parseFloat(mapOptions.defaultLongitude || tab?.options?.map?.center?.lng || postsByTabsSettings.defaultLongitude);
  
  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps API not loaded');
      return;
    }
    
    const mapOptions = {
      zoom: 11,
      center: { 
        lat: defaultLatitude,
        lng: defaultLongitude 
      },
      gestureHandling: 'greedy',
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: mapStyle
    };
    
    const map = new google.maps.Map(mapContainerRef.current, mapOptions);
    mapRef.current = map;
    
  }, [mapStyle]); 
  
  useEffect(() => {
    if (!posts?.length) {
      setEventByPlaces([]);
      return;
    }
    
    const placesData = groupEventsByPlaces(attributes, posts);
    setEventByPlaces(placesData);
  }, [posts, attributes]);
  
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !eventByPlaces || eventByPlaces.length === 0) return;
    
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
    
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    let markerOptions = {};
    if (markerIcon) {
      markerOptions.icon = {
        url: markerIcon,
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 32) // Center bottom of image
      };
    }
    
    const markers = eventByPlaces.map(place => {
      if (!place.place?.acf?.gps) {
        console.warn('Missing GPS data for place:', place.place?.id);
        return null;
      }
      
      const { gps } = place.place.acf;
      
      const lng = parseFloat(gps.lng || gps.long);
      const lat = parseFloat(gps.lat);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('Invalid GPS coordinates for place:', place.place?.id);
        return null;
      }
      
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: place.place.title?.rendered || place.place.title || 'Unnamed location',
        ...markerOptions,
      });
      
      marker.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: createInfoWindowContent(place)
        });
        infoWindow.open(map, marker);
      });
      
      return marker;
    }).filter(Boolean);
    
    markersRef.current = markers;
    
    const clusterer = new MarkerClusterer({
      map,
      markers,
      algorithm: new GridAlgorithm({
        maxDistance: 60,
        gridSize: 60
      }),
      renderer: {
        render: ({ count, position }) => 
          new google.maps.Marker({
            position,
            label: { 
              text: String(count), 
              color: "white", 
              fontSize: "10px",
              fontWeight: "bold" 
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: count < 10 ? 18 : (count < 20 ? 22 : 26),
              fillColor: "#d13d40", // BOTOXS red color
              fillOpacity: 0.9,
              strokeWeight: 2,
              strokeColor: "#FFFFFF",
            },
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          })
      }
    });
    
    clustererRef.current = clusterer;
    
    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker.getPosition()));
      map.fitBounds(bounds);
    }
    
    return () => {
      markers.forEach(marker => marker.setMap(null));
      if (clusterer) {
        clusterer.clearMarkers();
      }
    };
  }, [mapRef.current, eventByPlaces]);
  
  return (
    <div className="min-h-[500px] h-[500px] w-full relative">

      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        id={`map-${attributes.blockId}-${tab.index || 0}`}
      ></div>
      
      {(!eventByPlaces || eventByPlaces.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <div className="no-locations-message p-4 text-center">No locations found</div>
        </div>
      )}
      
      <div className="absolute bottom-2 left-2 bg-white p-2 text-xs z-10">
        Markers: {eventByPlaces?.length || 0}
      </div>
    </div>
  );
}