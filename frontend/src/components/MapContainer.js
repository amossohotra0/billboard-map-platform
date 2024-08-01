import React, { useCallback, useRef, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import Map from './Map';
import LoadingSpinner from './LoadingSpinner';

const MapContainer = ({ billboards, onBillboardClick }) => {
  const mapRef = useRef(null);

  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingSpinner />;
      case Status.FAILURE:
        return <div className="error-message">Error loading Google Maps</div>;
      case Status.SUCCESS:
        return (
          <Map
            ref={mapRef}
            billboards={billboards}
            onBillboardClick={onBillboardClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="map-container">
      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        render={render}
        libraries={['places', 'geometry']}
      />
    </div>
  );
};

export default MapContainer;
