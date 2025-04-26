import React, { useCallback, useState, useEffect } from '@wordpress/element';
import {InfoWindow, Map} from '@vis.gl/react-google-maps';
import {ClusteredMarkers} from './components/clustered-markers';
import groupEventsByPlaces from '../../utils/groupEventsByPlaces';

import './style.css';
import {InfoWindowContent} from './components/info-window-content';

const pluginSettings = window.postsByTabsSettings || {
  defaultLatitude: 48.8566,
  defaultLongitude: 2.3522
};

export default function EventsMapCluster (props) {

  const { attributes, posts, tab } = props;
  const { zoom } = tab;
  const geojson = groupEventsByPlaces(attributes, posts);
  const [numClusters, setNumClusters] = useState(0);
  const [infowindowData, setInfowindowData] = useState(null);
  
  const handleInfoWindowClose = useCallback(
    () => setInfowindowData(null),
    [setInfowindowData]
  );

  return (

      <Map
        mapId={'b5387d230c6cf22f'}
        defaultCenter={{
          lat: pluginSettings.defaultLatitude, 
          lng: pluginSettings.defaultLongitude
        }}
        defaultZoom={zoom || 11}
        gestureHandling={'greedy'}
        disableDefaultUI
        onClick={() => setInfowindowData(null)}
        className={'custom-marker-clustering-map'}>
        {!geojson && (
          <ClusteredMarkers
            geojson={geojson}
            setNumClusters={setNumClusters}
            setInfowindowData={setInfowindowData}
          />
        )}

        {infowindowData && (
          <InfoWindow
            onCloseClick={handleInfoWindowClose}
            anchor={infowindowData.anchor}>
            <InfoWindowContent features={infowindowData.features} />
          </InfoWindow>
        )}
      </Map>
  );
};
