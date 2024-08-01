import { useState, useCallback } from 'react';
import axios from 'axios';

// Mock data for development - replace with actual API calls
const mockBillboards = [
  {
    id: 1,
    name: 'Downtown Digital Display',
    latitude: 40.7589,
    longitude: -73.9851,
    address: '123 Broadway',
    city: 'New York',
    state: 'NY',
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
    image: 'https://via.placeholder.com/400x300/0066cc/ffffff?text=Digital+Billboard'
  },
  {
    id: 2,
    name: 'Highway 101 Static',
    latitude: 37.7749,
    longitude: -122.4194,
    address: '456 Highway 101',
    city: 'San Francisco',
    state: 'CA',
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
    image: 'https://via.placeholder.com/400x300/cc6600/ffffff?text=Static+Billboard'
  },
  {
    id: 3,
    name: 'Airport Boulevard Digital',
    latitude: 33.4484,
    longitude: -112.0740,
    address: '789 Airport Blvd',
    city: 'Phoenix',
    state: 'AZ',
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
    image: 'https://via.placeholder.com/400x300/009900/ffffff?text=Airport+Digital'
  },
  {
    id: 4,
    name: 'Mall Entrance Poster',
    latitude: 41.8781,
    longitude: -87.6298,
    address: '321 Shopping Center Dr',
    city: 'Chicago',
    state: 'IL',
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
    image: 'https://via.placeholder.com/400x300/cc0066/ffffff?text=Poster+Panel'
  },
  {
    id: 5,
    name: 'Downtown Wallscape',
    latitude: 39.7392,
    longitude: -104.9903,
    address: '555 Main Street',
    city: 'Denver',
    state: 'CO',
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
    image: 'https://via.placeholder.com/400x300/660099/ffffff?text=Wallscape'
  }
];

export const useBillboards = () => {
  const [billboards, setBillboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBillboards = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, replace with actual API call:
      // const response = await axios.get('/api/billboards');
      // setBillboards(response.data);
      
      setBillboards(mockBillboards);
    } catch (err) {
      setError(err.message || 'Failed to fetch billboards');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBillboardById = useCallback(async (id) => {
    try {
      // In production, replace with actual API call:
      // const response = await axios.get(`/api/billboards/${id}`);
      // return response.data;
      
      return mockBillboards.find(billboard => billboard.id === parseInt(id));
    } catch (err) {
      throw new Error(err.message || 'Failed to fetch billboard');
    }
  }, []);

  return {
    billboards,
    loading,
    error,
    fetchBillboards,
    fetchBillboardById
  };
};
