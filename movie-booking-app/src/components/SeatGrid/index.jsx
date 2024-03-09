import React from 'react';
import './SeatGrid.css'

const SeatGrid = ({ rows, columns, onSelectSeat, selectedSeats, unselectableSeats }) => {
  return (
    <div>
      {rows.map((row) => (
        <div key={row} className='seat-row'>
          {columns.map((col) => {
            const seat = `${row}${col}`;
            const isSelected = selectedSeats.includes(seat);
            const isUnselectable = unselectableSeats.includes(seat);
            // Concatenate classes based on conditions
            const seatClasses = `seat${isUnselectable ? ' unselectable' : ''}${isSelected ? ' selected' : ''}`;

            return (
              <div
                key={col}
                className={seatClasses}
                onClick={() => !isUnselectable && onSelectSeat(seat)}
              >
                {seat}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SeatGrid;
