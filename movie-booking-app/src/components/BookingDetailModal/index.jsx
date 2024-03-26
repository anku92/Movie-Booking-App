import React from 'react';
import Modal from 'react-modal';

const BookingDetailsModal = ({ isOpen, closeModal, cinema, movie, selectedSeats, schedule, showDate, price }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Booking Details Modal"
      className="modal-dialog modal-dialog-centered"
    >
      <div className="modal-content">
        <div className="modal-header bg-info text-white">
          <h5 className="modal-title">Booking Summary</h5>
          <button type="button" className="close text-white" onClick={closeModal}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <table className="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <th>Cinema:</th>
                      <td>{cinema.name}</td>
                    </tr>
                    <tr>
                      <th>Movie:</th>
                      <td>{movie.title}</td>
                    </tr>
                    <tr>
                      <th>Number of Tickets:</th>
                      <td>{selectedSeats.length}</td>
                    </tr>
                    <tr>
                      <th>Selected Seats:</th>
                      <td>{selectedSeats.length === 0 ? <small className='font-weight-bold text-danger'>None</small> : selectedSeats.join(', ')}</td>

                    </tr>
                    <tr>
                      <th>Ticket Price:</th>
                      <td>{selectedSeats.length === 0 ? 0 : price}</td>
                    </tr>
                    <tr>
                      <th>Total Amount:</th>
                      <td>{selectedSeats.length*price}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className='font-weight-bold m-0'>Show time: <span className='text-success'>{schedule}</span></p>
            <p className='font-weight-bold m-0'>Show Date: <span className='text-danger'>{showDate}</span></p>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
