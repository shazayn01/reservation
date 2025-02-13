import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const maxSeats = 15;
  const [seatsLeft, setSeatsLeft] = useState(maxSeats);
  const [reservations, setReservations] = useState([]);
  const [guestCount, setGuestCount] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const savedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
    setReservations(savedReservations);
    const seatsTaken = savedReservations.reduce((sum, res) => sum + res.guestCount, 0);
    setSeatsLeft(maxSeats - seatsTaken);
  }, []);

  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  const validateInputs = () => {
    if (!name || !phone || !guestCount) {
      alert('Please fill out all fields.');
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      alert('Name should contain only letters.');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert('Phone number must be 10 digits.');
      return false;
    }
    if (parseInt(guestCount) <= 0 || parseInt(guestCount) > seatsLeft) {
      alert('Invalid guest count.');
      return false;
    }
    return true;
  };

  const addOrUpdateReservation = () => {
    if (!validateInputs()) return;

    const newReservation = {
      name,
      phone,
      guestCount: parseInt(guestCount),
      checkInTime: new Date().toLocaleString(),
      status: 'Checked In',
    };

    let updatedReservations;
    if (editingIndex !== null) {
      const prevGuestCount = reservations[editingIndex].guestCount;
      updatedReservations = [...reservations];
      updatedReservations[editingIndex] = newReservation;
      setSeatsLeft(seatsLeft + prevGuestCount - newReservation.guestCount);
      setEditingIndex(null);
    } else {
      updatedReservations = [...reservations, newReservation];
      setSeatsLeft(seatsLeft - newReservation.guestCount);
    }
    setReservations(updatedReservations);
    resetFields();
  };

  const checkoutReservation = (index) => {
    const updatedReservations = [...reservations];
    if (updatedReservations[index].status === 'Checked Out') {
      alert('Already checked out.');
      return;
    }
    updatedReservations[index].status = 'Checked Out';
    setSeatsLeft(seatsLeft + updatedReservations[index].guestCount);
    setReservations(updatedReservations);
  };

  const deleteReservation = (index) => {
    const updatedReservations = [...reservations];
    if (updatedReservations[index].status === 'Checked In') {
      setSeatsLeft(seatsLeft + updatedReservations[index].guestCount);
    }
    updatedReservations.splice(index, 1);
    setReservations(updatedReservations);
  };

  const editReservation = (index) => {
    const res = reservations[index];
    setName(res.name);
    setPhone(res.phone);
    setGuestCount(res.guestCount.toString());
    setEditingIndex(index);
  };

  const resetFields = () => {
    setGuestCount('');
    setName('');
    setPhone('');
  };

  return (
    <div className="wrapper">
      <h1>Table Booking System</h1>
      <div className="form-container">
        <div className="form-group">
          <label>Guest Count:</label>
          <input
            type="number"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            placeholder="Number of Guests"
          />
        </div>
        <div className="form-group">
          <label>Customer Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
          />
        </div>
        <button className="reserve-btn" onClick={addOrUpdateReservation}>
          {editingIndex !== null ? 'Update Booking' : 'Book Table'}
        </button>
      </div>
      <h3 className="seats-available">Seats Available: <span>{seatsLeft}</span></h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Check-in Time</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td>{reservation.name}</td>
              <td>{reservation.phone}</td>
              <td>{reservation.checkInTime}</td>
              <td>{reservation.status}</td>
              <td>
                {reservation.status === 'Checked In' ? (
                  <button className="btn-action checkout" onClick={() => checkoutReservation(index)}>
                    Check Out
                  </button>
                ) : (
                  <button disabled className="btn-disabled">Checked Out</button>
                )}
                <button className="btn-action edit" onClick={() => editReservation(index)}>
                  Edit
                </button>
                <button className="btn-action delete" onClick={() => deleteReservation(index)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
