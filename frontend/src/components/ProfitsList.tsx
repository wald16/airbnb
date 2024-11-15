import React from 'react';

interface Profit {
    ProfitID: number;
    PropertyID: number;
    Profit: number;
    Revenue: number;
    Expenses: number;
}

interface ProfitsListProps {
    profits: Profit[];
}

const ProfitsList: React.FC<ProfitsListProps> = ({ profits }) => (
    <ul>
        {profits.map((profit) => (
            <li key={profit.ProfitID}>
                Propiedad {profit.PropertyID}: ${profit.Profit} (Entrada: ${profit.Revenue}, Gastos: ${profit.Expenses})
            </li>
        ))}
    </ul>
);

export default ProfitsList;
