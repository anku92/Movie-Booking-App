import React from 'react';
import Modal from 'react-modal';

const CustomAlertModal = ({ isOpen, onClose, message, displayBookingSummary, onViewBookingSummary }) => {
  return (
      <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          contentLabel="Custom Alert Modal"
          className="modal-dialog modal-dialog-centered"
      >
          <div className="modal-content">
              <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">Alert</h5>
                  <button type="button" className="close text-white" onClick={onClose}>
                      <span>&times;</span>
                  </button>
              </div>
              <div className="modal-body">
                  <p>{message}</p>
              </div>
              <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                  {displayBookingSummary && (
                      <button type="button" className="btn btn-primary" onClick={onViewBookingSummary}>View Booking Summary</button>
                  )}
              </div>
          </div>
      </Modal>
  );
};

export default CustomAlertModal;
