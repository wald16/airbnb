// Payments.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Payment {
    PaymentID: number;
    Date: string;
    Amount: number;
    ReservationID: number;
    GuestName: string;
}

interface PaymentsProps {
    month: number;
    year: number;
}

const Payments: React.FC<PaymentsProps> = ({ month, year }) => {
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/payments?month=${month}&year=${year}`
                );
                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };
        fetchPayments();
    }, [month, year]);

    return (
        <div className='payments'>
            <h3>Payments for {month}/{year}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Nombre Huesped</th>
                        <th>Fecha</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.PaymentID}>
                            <td>{payment.PaymentID}</td>
                            <td>{payment.GuestName}</td>
                            <td>{new Date(payment.Date).toLocaleDateString()}</td>
                            <td>${payment.Amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Payments;
