import mapStyles from './map.style.json';
import markerIcon from './marker.svg';

export function initializeMap(config, places, mapElement) {

  if (!mapElement) return { map: null, markers: [] };
  
  const config = block || {};

  let defaultPosition = { lat: 48.8566, lng: 2.3522 };
 
  if (config.default_address_lat && config.default_address_lng) {
    defaultPosition = {
      lat: parseFloat(config.default_address_lat),
      lng: parseFloat(config.default_address_lng)
    };
  }

  const map = new google.maps.Map(mapElement, {
    zoom: parseInt(mapElement.dataset.zoom) || 11,
    center: defaultPosition,
    streetViewControl: false,
    mapTypeControl: false,
    styles: mapStyles
  });
  
  const markers = addMarkers(map, places);

  return { map, markers };
}

function addMarkers(map, places) {

  if(!places) return [];

  const markers = [];
  
  places.forEach(place => {

    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lng);
    
    if (isNaN(lat) || isNaN(lng)) return;
    
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon: markerIcon,
      title: place.title,
      placeId: place.id
    });

    const content = place.content || '';
    const infoWindow = new google.maps.InfoWindow({
      content
    });

    marker.addListener('click', () => {
      map.setCenter(marker.getPosition());
      map.setZoom(11);
      infoWindow.open(map, marker);
    });
    
    markers.push(marker);
  });
  
  return markers;
}

export function centerMap(map, markers, userMarker = null) {
  if (!markers.length) return;
  
  const bounds = new google.maps.LatLngBounds();
  
  markers.forEach(marker => {
    bounds.extend(marker.getPosition());
  });
  
  if (userMarker) {
    bounds.extend(userMarker.getPosition());
  }
  
  map.setCenter(bounds.getCenter());
  map.fitBounds(bounds);
}

export function geolocateByAddress(address, callback, errorCallback) {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ address }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results[0]) {
      const location = results[0].geometry.location;
      const position = { 
        lat: location.lat(), 
        lng: location.lng() 
      };
      
      if (callback && typeof callback === 'function') {
        callback(position);
      }
      
      return position;
    } else {
      if (errorCallback && typeof errorCallback === 'function') {
        errorCallback(status);
      } else {
        console.error(`Geocode failed with status ${status}`);
      }
    }
  });
}