import React from 'react';
import '../styles/Header.css';

const Header = ({ onToggleFilters, billboardCount }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="logo">
            <i className="fas fa-map-marked-alt"></i>
            Billboard Map
          </h1>
          <div className="billboard-count">
            {billboardCount} billboards available
          </div>
        </div>
        
        <div className="header-right">
          <button 
            className="filter-toggle-btn"
            onClick={onToggleFilters}
            aria-label="Toggle filters"
          >
            <i className="fas fa-filter"></i>
            Filters
          </button>
          
          <div className="header-actions">
            <button className="action-btn">
              <i className="fas fa-search"></i>
            </button>
            <button className="action-btn">
              <i className="fas fa-user"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
