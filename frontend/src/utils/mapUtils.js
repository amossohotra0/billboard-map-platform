// Custom marker creation utility
export const createCustomMarker = ({ position, map, billboard, onClick }) => {
  // Create custom marker icon based on billboard type
  const getMarkerIcon = (type, availability) => {
    const baseUrl = 'data:image/svg+xml;base64,';
    
    let color = '#0066cc'; // Default blue
    let icon = 'rectangle-ad';
    
    switch (type) {
      case 'digital':
        color = '#00cc66';
        icon = 'tv';
        break;
      case 'static':
        color = '#cc6600';
        icon = 'rectangle-ad';
        break;
      case 'poster':
        color = '#cc0066';
        icon = 'image';
        break;
      case 'wallscape':
        color = '#6600cc';
        icon = 'building';
        break;
    }

    // Adjust opacity for availability
    if (availability === 'sold') {
      color = '#999999';
    } else if (availability === 'coming_soon') {
      color = '#ffcc00';
    }

    const svg = `
      <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" 
              fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="16" cy="16" r="8" fill="#ffffff"/>
        <text x="16" y="20" text-anchor="middle" font-family="FontAwesome" font-size="10" fill="${color}">
          ${getIconUnicode(icon)}
        </text>
      </svg>
    `;

    return {
      url: baseUrl + btoa(svg),
      scaledSize: new window.google.maps.Size(32, 40),
      anchor: new window.google.maps.Point(16, 40)
    };
  };

  const getIconUnicode = (iconName) => {
    const icons = {
      'tv': '\uf26c',
      'rectangle-ad': '\uf641',
      'image': '\uf03e',
      'building': '\uf1ad'
    };
    return icons[iconName] || icons['rectangle-ad'];
  };

  // Create the marker
  const marker = new window.google.maps.Marker({
    position,
    map,
    icon: getMarkerIcon(billboard.type, billboard.availability),
    title: billboard.name,
    animation: window.google.maps.Animation.DROP
  });

  // Create info window content
  const infoWindowContent = `
    <div class="marker-info-window">
      <h3>${billboard.name}</h3>
      <div class="info-details">
        <p><strong>Type:</strong> ${billboard.type.charAt(0).toUpperCase() + billboard.type.slice(1)}</p>
        <p><strong>Size:</strong> ${billboard.size}</p>
        <p><strong>Location:</strong> ${billboard.city}, ${billboard.state}</p>
        <p><strong>Traffic:</strong> ${billboard.dailyTraffic.toLocaleString()} daily</p>
        <p><strong>Rate:</strong> $${billboard.monthlyRate.toLocaleString()}/month</p>
        <p class="availability-${billboard.availability}">
          <strong>Status:</strong> ${billboard.availability.replace('_', ' ').toUpperCase()}
        </p>
      </div>
      <button class="info-window-btn" onclick="window.openBillboardDetails(${billboard.id})">
        View Details
      </button>
    </div>
  `;

  const infoWindow = new window.google.maps.InfoWindow({
    content: infoWindowContent
  });

  // Add click listener to marker
  marker.addListener('click', () => {
    // Close any open info windows
    if (window.currentInfoWindow) {
      window.currentInfoWindow.close();
    }
    
    // Open new info window
    infoWindow.open(map, marker);
    window.currentInfoWindow = infoWindow;
    
    // Call the onClick callback
    if (onClick) {
      onClick();
    }
  });

  // Store reference to billboard data
  marker.billboardData = billboard;

  return marker;
};

// Utility to calculate distance between two points
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

// Utility to format coordinates
export const formatCoordinates = (lat, lng) => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// Utility to get map bounds for a set of billboards
export const getBoundsForBillboards = (billboards) => {
  if (!billboards || billboards.length === 0) return null;

  const bounds = new window.google.maps.LatLngBounds();
  billboards.forEach(billboard => {
    bounds.extend(new window.google.maps.LatLng(billboard.latitude, billboard.longitude));
  });
  
  return bounds;
};

// Global function for info window button clicks
window.openBillboardDetails = (billboardId) => {
  // This will be handled by the parent component
  const event = new CustomEvent('openBillboardDetails', { 
    detail: { billboardId } 
  });
  window.dispatchEvent(event);
};
