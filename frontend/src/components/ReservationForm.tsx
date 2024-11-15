import React, { useState } from 'react';
import axios from 'axios';

const ReservationForm: React.FC = () => {
    const [newGuest, setNewGuest] = useState({
        PropertyID: 1,
        StartDate: '',
        EndDate: '',
        TotalAmount: 0,
        GuestName: '',
        Status: 'Pending', // Default status
    });

    const handleAddReservation = () => {
        axios
            .post('http://localhost:3001/reservations', newGuest)
            .then(() => {
                alert('New reservation added!');
                setNewGuest({
                    PropertyID: 1,
                    StartDate: '',
                    EndDate: '',
                    TotalAmount: 0,
                    GuestName: '',
                    Status: '',
                });
            })
            .catch((error) => {
                console.error('Error:', error.response?.data || error.message);
                alert('Error adding reservation.');
            });
    };

    return (
        <div className='reservation-form'>
            <h2>Hacé una Reserva</h2>
            <div>
                <input
                    type="text"
                    placeholder="Guest Name"
                    value={newGuest.GuestName}
                    onChange={(e) => setNewGuest({ ...newGuest, GuestName: e.target.value })}
                />
                <input
                    type="date"
                    value={newGuest.StartDate}
                    onChange={(e) => setNewGuest({ ...newGuest, StartDate: e.target.value })}
                />
                <input
                    type="date"
                    value={newGuest.EndDate}
                    onChange={(e) => setNewGuest({ ...newGuest, EndDate: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Total Amount"
                    value={newGuest.TotalAmount}
                    onChange={(e) => setNewGuest({ ...newGuest, TotalAmount: Number(e.target.value) })}
                />
                {/* Add the Status dropdown */}
                <select
                    value={newGuest.Status}
                    onChange={(e) => setNewGuest({ ...newGuest, Status: e.target.value })}
                >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <button onClick={handleAddReservation}>Crear Reserva</button>
            </div>
        </div>
    );
};

export default ReservationForm;
