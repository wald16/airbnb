// Expenses.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Expense {
    ExpenseID: number;
    Date: string;
    Amount: number;
    Category: string;
    Description: string;
}

interface ExpensesProps {
    month: number;
    year: number;
}

const Expenses: React.FC<ExpensesProps> = ({ month, year }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/expenses?month=${month}&year=${year}`
                );
                setExpenses(response.data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };
        fetchExpenses();
    }, [month, year]);

    return (
        <div className='expenses'>
            <h3>Expenses for {month}/{year}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Gasto ID</th>
                        <th>Fecha</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.ExpenseID}>
                            <td>{expense.ExpenseID}</td>
                            <td>{new Date(expense.Date).toLocaleDateString()}</td>
                            <td>${expense.Amount}</td>
                            <td>{expense.Category}</td>
                            <td>{expense.Description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Expenses;
