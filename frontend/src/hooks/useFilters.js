import { useState, useMemo } from 'react';

export const useFilters = (billboards) => {
  const [filters, setFilters] = useState({
    type: [],
    size: [],
    availability: [],
    priceRange: [],
    location: '',
    trafficMin: '',
    trafficMax: ''
  });

  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      size: [],
      availability: [],
      priceRange: [],
      location: '',
      trafficMin: '',
      trafficMax: ''
    });
  };

  const filteredBillboards = useMemo(() => {
    if (!billboards || billboards.length === 0) return [];

    return billboards.filter(billboard => {
      // Type filter
      if (filters.type.length > 0) {
        const typeValues = filters.type.map(t => t.value);
        if (!typeValues.includes(billboard.type)) return false;
      }

      // Size filter
      if (filters.size.length > 0) {
        const sizeValues = filters.size.map(s => s.value);
        if (!sizeValues.includes(billboard.size)) return false;
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const availabilityValues = filters.availability.map(a => a.value);
        if (!availabilityValues.includes(billboard.availability)) return false;
      }

      // Price range filter
      if (filters.priceRange.length > 0) {
        const matchesPriceRange = filters.priceRange.some(range => {
          const [min, max] = range.value.split('-').map(v => 
            v === '10000+' ? Infinity : parseInt(v)
          );
          return billboard.monthlyRate >= min && 
                 (max === Infinity || billboard.monthlyRate <= max);
        });
        if (!matchesPriceRange) return false;
      }

      // Location filter (city, state, or address)
      if (filters.location.trim()) {
        const locationQuery = filters.location.toLowerCase().trim();
        const matchesLocation = 
          billboard.city.toLowerCase().includes(locationQuery) ||
          billboard.state.toLowerCase().includes(locationQuery) ||
          billboard.address.toLowerCase().includes(locationQuery);
        if (!matchesLocation) return false;
      }

      // Traffic count filter
      if (filters.trafficMin && billboard.dailyTraffic < parseInt(filters.trafficMin)) {
        return false;
      }
      if (filters.trafficMax && billboard.dailyTraffic > parseInt(filters.trafficMax)) {
        return false;
      }

      return true;
    });
  }, [billboards, filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredBillboards
  };
};
