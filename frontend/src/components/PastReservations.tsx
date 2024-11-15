import React, { useState } from 'react';
import axios from 'axios';

const PastReservations: React.FC<{ reservations: any[] }> = ({ reservations }) => {
    // Sort reservations by end date (if not sorted already in backend)
    const sortedReservations = reservations.sort((a, b) => new Date(b.EndDate).getTime() - new Date(a.EndDate).getTime());

    const [editableStatus, setEditableStatus] = useState<{ [key: number]: string }>({}); // To track statuses being edited

    const handleStatusChange = (id: number, newStatus: string) => {
        axios
            .patch(`http://localhost:3001/reservations/${id}`, { Status: newStatus })
            .then(() => {
                alert('Status updated successfully!');
                setEditableStatus((prev) => ({ ...prev, [id]: newStatus }));
            })
            .catch((error) => {
                console.error('Error updating status:', error.response?.data || error.message);
                alert('Error updating status.');
            });
    };

    return (
        <div className="past-reservations">
            <h2>Reservas</h2>
            {reservations.length > 0 ? (
                <table className="reservation-table">
                    <thead>
                        <tr>
                            <th>Nombre del Huesped</th>
                            <th>Desde</th>
                            <th>Hasta</th>
                            <th>Estado</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedReservations.map((reservation) => (
                            <tr key={reservation.ReservationID}>
                                <td>{reservation.GuestName}</td>
                                <td>{new Date(reservation.StartDate).toLocaleDateString()}</td>
                                <td>{new Date(reservation.EndDate).toLocaleDateString()}</td>
                                <td>
                                    <select
                                        className={
                                            reservation.Status === 'confirmed'
                                                ? 'status-confirmed'
                                                : reservation.Status === 'cancelled'
                                                    ? 'status-cancelled'
                                                    : ''
                                        }
                                        value={editableStatus[reservation.ReservationID] || reservation.Status}
                                        onChange={(e) => handleStatusChange(reservation.ReservationID, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>${reservation.TotalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No reservations available.</p>
            )}
        </div>
    );
};

export default PastReservations;
