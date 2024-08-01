import React from 'react';
import Modal from 'react-modal';
import '../styles/BillboardModal.css';

// Set app element for accessibility
Modal.setAppElement('#root');

const BillboardModal = ({ billboard, isOpen, onClose }) => {
  if (!billboard) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTraffic = (traffic) => {
    return new Intl.NumberFormat('en-US').format(traffic);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="billboard-modal"
      overlayClassName="billboard-modal-overlay"
      contentLabel="Billboard Details"
    >
      <div className="modal-header">
        <h2>{billboard.name}</h2>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="modal-content">
        <div className="billboard-image">
          {billboard.image ? (
            <img src={billboard.image} alt={billboard.name} />
          ) : (
            <div className="placeholder-image">
              <i className="fas fa-image"></i>
              <span>No image available</span>
            </div>
          )}
        </div>

        <div className="billboard-details">
          <div className="detail-section">
            <h3>Location Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Address:</span>
                <span className="value">{billboard.address}</span>
              </div>
              <div className="detail-item">
                <span className="label">City:</span>
                <span className="value">{billboard.city}, {billboard.state}</span>
              </div>
              <div className="detail-item">
                <span className="label">Coordinates:</span>
                <span className="value">
                  {billboard.latitude.toFixed(6)}, {billboard.longitude.toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Billboard Specifications</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Type:</span>
                <span className="value billboard-type">
                  <i className={`fas ${billboard.type === 'digital' ? 'fa-tv' : 'fa-rectangle-ad'}`}></i>
                  {billboard.type.charAt(0).toUpperCase() + billboard.type.slice(1)}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Size:</span>
                <span className="value">{billboard.size}</span>
              </div>
              <div className="detail-item">
                <span className="label">Facing:</span>
                <span className="value">{billboard.facing}</span>
              </div>
              <div className="detail-item">
                <span className="label">Illuminated:</span>
                <span className="value">
                  {billboard.illuminated ? (
                    <span className="status-yes"><i className="fas fa-lightbulb"></i> Yes</span>
                  ) : (
                    <span className="status-no"><i className="fas fa-ban"></i> No</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Traffic & Performance</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Daily Traffic:</span>
                <span className="value traffic-count">
                  <i className="fas fa-car"></i>
                  {formatTraffic(billboard.dailyTraffic)} vehicles
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Speed Limit:</span>
                <span className="value">{billboard.speedLimit} mph</span>
              </div>
              <div className="detail-item">
                <span className="label">Visibility:</span>
                <span className="value">{billboard.visibility}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Pricing & Availability</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Monthly Rate:</span>
                <span className="value price">
                  {formatPrice(billboard.monthlyRate)}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Availability:</span>
                <span className={`value status-${billboard.availability}`}>
                  <i className={`fas ${
                    billboard.availability === 'available' ? 'fa-check-circle' :
                    billboard.availability === 'coming_soon' ? 'fa-clock' : 'fa-times-circle'
                  }`}></i>
                  {billboard.availability.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Available Date:</span>
                <span className="value">
                  {billboard.availableDate ? 
                    new Date(billboard.availableDate).toLocaleDateString() : 
                    'Contact for details'
                  }
                </span>
              </div>
            </div>
          </div>

          {billboard.description && (
            <div className="detail-section">
              <h3>Description</h3>
              <p className="description">{billboard.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn-secondary" onClick={onClose}>
          Close
        </button>
        <button className="btn-primary">
          <i className="fas fa-envelope"></i>
          Contact About This Billboard
        </button>
      </div>
    </Modal>
  );
};

export default BillboardModal;
