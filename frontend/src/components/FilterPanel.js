import React from 'react';
import Select from 'react-select';
import '../styles/FilterPanel.css';

const FilterPanel = ({ isOpen, filters, onFilterChange, onClearFilters, onClose }) => {
  const billboardTypes = [
    { value: 'static', label: 'Static Billboard' },
    { value: 'digital', label: 'Digital Billboard' },
    { value: 'poster', label: 'Poster Panel' },
    { value: 'wallscape', label: 'Wallscape' }
  ];

  const sizeOptions = [
    { value: '14x48', label: '14\' x 48\' Bulletin' },
    { value: '12x24', label: '12\' x 24\' Poster' },
    { value: '6x12', label: '6\' x 12\' Junior' },
    { value: '10x30', label: '10\' x 30\' Digital' }
  ];

  const availabilityOptions = [
    { value: 'available', label: 'Available Now' },
    { value: 'coming_soon', label: 'Coming Soon' },
    { value: 'sold', label: 'Sold Out' }
  ];

  const priceRanges = [
    { value: '0-1000', label: '$0 - $1,000' },
    { value: '1000-5000', label: '$1,000 - $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: '10000+', label: '$10,000+' }
  ];

  return (
    <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
      <div className="filter-header">
        <h3>
          <i className="fas fa-filter"></i>
          Filter Billboards
        </h3>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="filter-content">
        <div className="filter-group">
          <label>Billboard Type</label>
          <Select
            isMulti
            options={billboardTypes}
            value={filters.type}
            onChange={(selected) => onFilterChange('type', selected)}
            placeholder="Select types..."
            className="filter-select"
          />
        </div>

        <div className="filter-group">
          <label>Size</label>
          <Select
            isMulti
            options={sizeOptions}
            value={filters.size}
            onChange={(selected) => onFilterChange('size', selected)}
            placeholder="Select sizes..."
            className="filter-select"
          />
        </div>

        <div className="filter-group">
          <label>Availability</label>
          <Select
            isMulti
            options={availabilityOptions}
            value={filters.availability}
            onChange={(selected) => onFilterChange('availability', selected)}
            placeholder="Select availability..."
            className="filter-select"
          />
        </div>

        <div className="filter-group">
          <label>Price Range (Monthly)</label>
          <Select
            isMulti
            options={priceRanges}
            value={filters.priceRange}
            onChange={(selected) => onFilterChange('priceRange', selected)}
            placeholder="Select price range..."
            className="filter-select"
          />
        </div>

        <div className="filter-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="Enter city, state, or zip code"
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Traffic Count (Daily)</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.trafficMin || ''}
              onChange={(e) => onFilterChange('trafficMin', e.target.value)}
              className="filter-input range-input"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.trafficMax || ''}
              onChange={(e) => onFilterChange('trafficMax', e.target.value)}
              className="filter-input range-input"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button className="clear-btn" onClick={onClearFilters}>
            <i className="fas fa-undo"></i>
            Clear All
          </button>
          <button className="apply-btn" onClick={onClose}>
            <i className="fas fa-check"></i>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
