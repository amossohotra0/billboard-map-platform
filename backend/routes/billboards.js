const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();

// Mock data - replace with actual database queries
const mockBillboards = [
  {
    id: 1,
    name: 'Downtown Digital Display',
    latitude: 40.7589,
    longitude: -73.9851,
    address: '123 Broadway',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    type: 'digital',
    size: '14x48',
    facing: 'North',
    illuminated: true,
    dailyTraffic: 85000,
    speedLimit: 25,
    visibility: 'Excellent',
    monthlyRate: 8500,
    availability: 'available',
    availableDate: '2025-07-01',
    description: 'Prime location in Times Square area with high visibility and foot traffic.',
    image: 'https://via.placeholder.com/400x300/0066cc/ffffff?text=Digital+Billboard',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z'
  },
  {
    id: 2,
    name: 'Highway 101 Static',
    latitude: 37.7749,
    longitude: -122.4194,
    address: '456 Highway 101',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    type: 'static',
    size: '14x48',
    facing: 'South',
    illuminated: true,
    dailyTraffic: 120000,
    speedLimit: 65,
    visibility: 'Good',
    monthlyRate: 6500,
    availability: 'available',
    availableDate: '2025-06-25',
    description: 'High-traffic highway location with excellent commuter visibility.',
    image: 'https://via.placeholder.com/400x300/cc6600/ffffff?text=Static+Billboard',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z'
  },
  {
    id: 3,
    name: 'Airport Boulevard Digital',
    latitude: 33.4484,
    longitude: -112.0740,
    address: '789 Airport Blvd',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85001',
    type: 'digital',
    size: '10x30',
    facing: 'East',
    illuminated: true,
    dailyTraffic: 95000,
    speedLimit: 45,
    visibility: 'Excellent',
    monthlyRate: 7200,
    availability: 'coming_soon',
    availableDate: '2025-08-15',
    description: 'Strategic airport route location with business traveler exposure.',
    image: 'https://via.placeholder.com/400x300/009900/ffffff?text=Airport+Digital',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z'
  },
  {
    id: 4,
    name: 'Mall Entrance Poster',
    latitude: 41.8781,
    longitude: -87.6298,
    address: '321 Shopping Center Dr',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    type: 'poster',
    size: '12x24',
    facing: 'West',
    illuminated: false,
    dailyTraffic: 45000,
    speedLimit: 35,
    visibility: 'Good',
    monthlyRate: 2800,
    availability: 'available',
    availableDate: '2025-06-21',
    description: 'High-visibility location at major shopping center entrance.',
    image: 'https://via.placeholder.com/400x300/cc0066/ffffff?text=Poster+Panel',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z'
  },
  {
    id: 5,
    name: 'Downtown Wallscape',
    latitude: 39.7392,
    longitude: -104.9903,
    address: '555 Main Street',
    city: 'Denver',
    state: 'CO',
    zipCode: '80202',
    type: 'wallscape',
    size: '20x60',
    facing: 'North',
    illuminated: true,
    dailyTraffic: 65000,
    speedLimit: 30,
    visibility: 'Excellent',
    monthlyRate: 12000,
    availability: 'sold',
    availableDate: null,
    description: 'Massive wallscape in downtown core with premium visibility.',
    image: 'https://via.placeholder.com/400x300/660099/ffffff?text=Wallscape',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z'
  }
];

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// GET /api/billboards - Get all billboards with optional filtering
router.get('/', [
  query('type').optional().isIn(['static', 'digital', 'poster', 'wallscape']),
  query('availability').optional().isIn(['available', 'coming_soon', 'sold']),
  query('city').optional().isString().trim(),
  query('state').optional().isString().trim(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('minTraffic').optional().isNumeric(),
  query('maxTraffic').optional().isNumeric(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, (req, res) => {
  try {
    let filteredBillboards = [...mockBillboards];
    
    // Apply filters
    const { type, availability, city, state, minPrice, maxPrice, minTraffic, maxTraffic } = req.query;
    
    if (type) {
      filteredBillboards = filteredBillboards.filter(b => b.type === type);
    }
    
    if (availability) {
      filteredBillboards = filteredBillboards.filter(b => b.availability === availability);
    }
    
    if (city) {
      filteredBillboards = filteredBillboards.filter(b => 
        b.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    if (state) {
      filteredBillboards = filteredBillboards.filter(b => 
        b.state.toLowerCase() === state.toLowerCase()
      );
    }
    
    if (minPrice) {
      filteredBillboards = filteredBillboards.filter(b => b.monthlyRate >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      filteredBillboards = filteredBillboards.filter(b => b.monthlyRate <= parseInt(maxPrice));
    }
    
    if (minTraffic) {
      filteredBillboards = filteredBillboards.filter(b => b.dailyTraffic >= parseInt(minTraffic));
    }
    
    if (maxTraffic) {
      filteredBillboards = filteredBillboards.filter(b => b.dailyTraffic <= parseInt(maxTraffic));
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBillboards = filteredBillboards.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedBillboards,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredBillboards.length / limit),
        totalItems: filteredBillboards.length,
        itemsPerPage: limit,
        hasNextPage: endIndex < filteredBillboards.length,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /api/billboards/:id - Get single billboard by ID
router.get('/:id', (req, res) => {
  try {
    const billboardId = parseInt(req.params.id);
    const billboard = mockBillboards.find(b => b.id === billboardId);
    
    if (!billboard) {
      return res.status(404).json({
        error: 'Billboard not found',
        message: `Billboard with ID ${billboardId} does not exist`
      });
    }
    
    res.json({
      success: true,
      data: billboard
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /api/billboards/search/nearby - Find billboards near coordinates
router.get('/search/nearby', [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  query('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  query('radius').optional().isFloat({ min: 0.1, max: 100 }).withMessage('Radius must be between 0.1 and 100 miles')
], handleValidationErrors, (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);
    
    // Calculate distance using Haversine formula
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
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
    
    const toRad = (value) => value * Math.PI / 180;
    
    const nearbyBillboards = mockBillboards
      .map(billboard => ({
        ...billboard,
        distance: calculateDistance(centerLat, centerLng, billboard.latitude, billboard.longitude)
      }))
      .filter(billboard => billboard.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);
    
    res.json({
      success: true,
      data: nearbyBillboards,
      searchCriteria: {
        center: { lat: centerLat, lng: centerLng },
        radius: searchRadius,
        unit: 'miles'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /api/billboards/stats/summary - Get billboard statistics
router.get('/stats/summary', (req, res) => {
  try {
    const stats = {
      total: mockBillboards.length,
      available: mockBillboards.filter(b => b.availability === 'available').length,
      comingSoon: mockBillboards.filter(b => b.availability === 'coming_soon').length,
      sold: mockBillboards.filter(b => b.availability === 'sold').length,
      byType: {
        static: mockBillboards.filter(b => b.type === 'static').length,
        digital: mockBillboards.filter(b => b.type === 'digital').length,
        poster: mockBillboards.filter(b => b.type === 'poster').length,
        wallscape: mockBillboards.filter(b => b.type === 'wallscape').length
      },
      priceRange: {
        min: Math.min(...mockBillboards.map(b => b.monthlyRate)),
        max: Math.max(...mockBillboards.map(b => b.monthlyRate)),
        average: Math.round(mockBillboards.reduce((sum, b) => sum + b.monthlyRate, 0) / mockBillboards.length)
      },
      trafficRange: {
        min: Math.min(...mockBillboards.map(b => b.dailyTraffic)),
        max: Math.max(...mockBillboards.map(b => b.dailyTraffic)),
        average: Math.round(mockBillboards.reduce((sum, b) => sum + b.dailyTraffic, 0) / mockBillboards.length)
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
