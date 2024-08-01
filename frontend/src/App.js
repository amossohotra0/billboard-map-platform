import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MapContainer from './components/MapContainer';
import FilterPanel from './components/FilterPanel';
import BillboardModal from './components/BillboardModal';
import LoadingSpinner from './components/LoadingSpinner';
import { useBillboards } from './hooks/useBillboards';
import { useFilters } from './hooks/useFilters';
import './styles/App.css';

function App() {
  const [selectedBillboard, setSelectedBillboard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  const { billboards, loading, error, fetchBillboards } = useBillboards();
  const { filters, updateFilter, clearFilters, filteredBillboards } = useFilters(billboards);

  useEffect(() => {
    fetchBillboards();
  }, []);

  const handleBillboardClick = (billboard) => {
    setSelectedBillboard(billboard);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBillboard(null);
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <Router>
      <div className="app">
        <Header 
          onToggleFilters={toggleFilterPanel}
          billboardCount={filteredBillboards.length}
        />
        
        <div className="app-content">
          <FilterPanel
            isOpen={isFilterPanelOpen}
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
            onClose={() => setIsFilterPanelOpen(false)}
          />
          
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <MapContainer
                    billboards={filteredBillboards}
                    onBillboardClick={handleBillboardClick}
                  />
                } 
              />
            </Routes>
          </main>
        </div>

        <BillboardModal
          billboard={selectedBillboard}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </Router>
  );
}

export default App;
