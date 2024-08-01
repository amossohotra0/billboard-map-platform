jQuery(document).ready(function($) {
    'use strict';
    
    let map;
    let markers = [];
    let infoWindow;
    let billboards = [];
    
    // Initialize the map
    function initMap() {
        const container = $('#billboard-map-container');
        const mapElement = document.getElementById('billboard-map');
        
        if (!mapElement || !window.google) {
            console.error('Google Maps API not loaded or map element not found');
            return;
        }
        
        const centerLat = parseFloat(container.data('center-lat')) || 39.8283;
        const centerLng = parseFloat(container.data('center-lng')) || -98.5795;
        const zoom = parseInt(container.data('zoom')) || 4;
        
        map = new google.maps.Map(mapElement, {
            center: { lat: centerLat, lng: centerLng },
            zoom: zoom,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });
        
        infoWindow = new google.maps.InfoWindow();
        
        // Load initial billboards
        loadBillboards();
    }
    
    // Load billboards via AJAX
    function loadBillboards(filters = {}) {
        $('#billboard-loading').show();
        
        $.ajax({
            url: billboardMapAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'get_billboards',
                nonce: billboardMapAjax.nonce,
                ...filters
            },
            success: function(response) {
                if (response.success) {
                    billboards = response.data;
                    displayBillboards();
                } else {
                    console.error('Failed to load billboards:', response.data);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX error:', error);
            },
            complete: function() {
                $('#billboard-loading').hide();
            }
        });
    }
    
    // Display billboards on map
    function displayBillboards() {
        // Clear existing markers
        clearMarkers();
        
        billboards.forEach(function(billboard) {
            const marker = createMarker(billboard);
            markers.push(marker);
        });
        
        // Fit map to show all markers
        if (markers.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            markers.forEach(function(marker) {
                bounds.extend(marker.getPosition());
            });
            map.fitBounds(bounds);
        }
    }
    
    // Create marker for billboard
    function createMarker(billboard) {
        const marker = new google.maps.Marker({
            position: { lat: billboard.latitude, lng: billboard.longitude },
            map: map,
            title: billboard.name,
            icon: getMarkerIcon(billboard.type, billboard.availability)
        });
        
        marker.addListener('click', function() {
            showInfoWindow(marker, billboard);
        });
        
        return marker;
    }
    
    // Get custom marker icon
    function getMarkerIcon(type, availability) {
        let color = '#0073aa';
        
        switch (type) {
            case 'digital':
                color = '#28a745';
                break;
            case 'static':
                color = '#fd7e14';
                break;
            case 'poster':
                color = '#e83e8c';
                break;
            case 'wallscape':
                color = '#6f42c1';
                break;
        }
        
        if (availability === 'sold') {
            color = '#6c757d';
        } else if (availability === 'coming_soon') {
            color = '#ffc107';
        }
        
        return {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        };
    }
    
    // Show info window
    function showInfoWindow(marker, billboard) {
        const content = `
            <div class="billboard-info-window">
                <h3>${billboard.name}</h3>
                <p><strong>Type:</strong> ${billboard.type.charAt(0).toUpperCase() + billboard.type.slice(1)}</p>
                <p><strong>Size:</strong> ${billboard.size}</p>
                <p><strong>Location:</strong> ${billboard.city}, ${billboard.state}</p>
                <p><strong>Traffic:</strong> ${billboard.dailyTraffic.toLocaleString()} daily</p>
                <p><strong>Rate:</strong> $${billboard.monthlyRate.toLocaleString()}/month</p>
                <p><strong>Status:</strong> <span class="availability-${billboard.availability}">${billboard.availability.replace('_', ' ').toUpperCase()}</span></p>
                <button class="btn btn-primary btn-sm" onclick="showBillboardDetails(${billboard.id})">View Details</button>
            </div>
        `;
        
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
    }
    
    // Clear all markers
    function clearMarkers() {
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
    }
    
    // Show billboard details modal
    window.showBillboardDetails = function(billboardId) {
        const billboard = billboards.find(b => b.id === billboardId);
        if (!billboard) return;
        
        const modalContent = `
            <div class="billboard-details">
                ${billboard.image ? `<img src="${billboard.image}" alt="${billboard.name}" class="billboard-image">` : ''}
                <div class="billboard-detail"><strong>Address:</strong> ${billboard.address}</div>
                <div class="billboard-detail"><strong>City:</strong> ${billboard.city}, ${billboard.state}</div>
                <div class="billboard-detail"><strong>Type:</strong> ${billboard.type.charAt(0).toUpperCase() + billboard.type.slice(1)}</div>
                <div class="billboard-detail"><strong>Size:</strong> ${billboard.size}</div>
                <div class="billboard-detail"><strong>Facing:</strong> ${billboard.facing}</div>
                <div class="billboard-detail"><strong>Illuminated:</strong> ${billboard.illuminated ? 'Yes' : 'No'}</div>
                <div class="billboard-detail"><strong>Daily Traffic:</strong> ${billboard.dailyTraffic.toLocaleString()} vehicles</div>
                <div class="billboard-detail"><strong>Monthly Rate:</strong> $${billboard.monthlyRate.toLocaleString()}</div>
                <div class="billboard-detail"><strong>Availability:</strong> <span class="availability-${billboard.availability}">${billboard.availability.replace('_', ' ').toUpperCase()}</span></div>
                ${billboard.description ? `<div class="billboard-detail"><strong>Description:</strong> ${billboard.description}</div>` : ''}
            </div>
        `;
        
        $('#modal-title').text(billboard.name);
        $('#modal-content').html(modalContent);
        $('#billboard-modal').show();
        
        // Store current billboard for contact form
        $('#contact-billboard').data('billboard-id', billboardId);
    };
    
    // Filter functionality
    $('#apply-filters').on('click', function() {
        const filters = {
            type: $('#type-filter').val(),
            availability: $('#availability-filter').val(),
            city: $('#city-filter').val()
        };
        
        loadBillboards(filters);
    });
    
    $('#clear-filters').on('click', function() {
        $('#type-filter').val('');
        $('#availability-filter').val('');
        $('#city-filter').val('');
        loadBillboards();
    });
    
    // Modal functionality
    $('.close').on('click', function() {
        $('#billboard-modal').hide();
    });
    
    $(window).on('click', function(event) {
        if (event.target.id === 'billboard-modal') {
            $('#billboard-modal').hide();
        }
    });
    
    // Contact button functionality
    $('#contact-billboard').on('click', function() {
        const billboardId = $(this).data('billboard-id');
        const billboard = billboards.find(b => b.id === billboardId);
        
        if (billboard) {
            // You can customize this to open a contact form or redirect to a contact page
            const subject = encodeURIComponent(`Inquiry about ${billboard.name}`);
            const body = encodeURIComponent(`I'm interested in learning more about the billboard "${billboard.name}" located at ${billboard.address}, ${billboard.city}, ${billboard.state}.`);
            
            window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        }
    });
    
    // Initialize map when Google Maps API is loaded
    if (window.google && window.google.maps) {
        initMap();
    } else {
        // Wait for Google Maps API to load
        window.initBillboardMap = initMap;
        
        // Add callback to Google Maps script if not already present
        const script = document.querySelector('script[src*="maps.googleapis.com"]');
        if (script && !script.src.includes('callback=')) {
            script.src += '&callback=initBillboardMap';
        }
    }
});
