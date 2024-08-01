import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { createCustomMarker } from '../utils/mapUtils';

const Map = forwardRef(({ billboards, onBillboardClick }, ref) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [markerClusterer, setMarkerClusterer] = useState(null);

  useImperativeHandle(ref, () => ({
    panTo: (lat, lng) => {
      if (map) {
        map.panTo({ lat, lng });
      }
    },
    setZoom: (zoom) => {
      if (map) {
        map.setZoom(zoom);
      }
    }
  }));

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
        zoom: 4,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      setMap(newMap);

      // Initialize marker clusterer
      const clusterer = new MarkerClusterer({
        map: newMap,
        markers: [],
        algorithm: new MarkerClusterer.GridAlgorithm({ gridSize: 60 })
      });
      setMarkerClusterer(clusterer);
    }
  }, [map]);

  // Update markers when billboards change
  useEffect(() => {
    if (!map || !markerClusterer) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markerClusterer.clearMarkers();

    // Create new markers
    const newMarkers = billboards.map(billboard => {
      const marker = createCustomMarker({
        position: { lat: billboard.latitude, lng: billboard.longitude },
        map: map,
        billboard: billboard,
        onClick: () => onBillboardClick(billboard)
      });

      return marker;
    });

    setMarkers(newMarkers);
    markerClusterer.addMarkers(newMarkers);

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  }, [billboards, map, markerClusterer, onBillboardClick]);

  return (
    <div 
      ref={mapRef} 
      className="map"
      style={{ width: '100%', height: '100%' }}
    />
  );
});

Map.displayName = 'Map';

export default Map;
