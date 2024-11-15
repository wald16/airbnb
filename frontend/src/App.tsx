// App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationForm from './components/ReservationForm';
import ProfitsList from './components/ProfitsList';
import PastReservations from './components/PastReservations';
import Payments from './components/Payments';
import Expenses from './components/Expenses';
import './App.css';


const App: React.FC = () => {
  const [profits, setProfits] = useState<any[]>([]);
  const [month, setMonth] = useState(11);
  const [year, setYear] = useState(2024);
  const [pastReservations, setPastReservations] = useState<any[]>([]);

  const fetchData = () => {
    console.log("Fetching data for month:", month, "and year:", year); // Debugging line
    axios
      .get(`http://localhost:3001/profits?month=${month}&year=${year}`)
      .then((response) => setProfits(response.data))
      .catch((error) => console.error(error));

    axios
      .get(`http://localhost:3001/past-reservations?month=${month}&year=${year}`)
      .then((response) => setPastReservations(response.data))
      .catch((error) => console.error(error));
  };

  // Trigger fetch when month or year changes
  useEffect(() => {
    fetchData();
  }, [month, year]);

  return (
    <div className="App">
      <h1>Airbnb Wald</h1>

      {/* Reservation Form */}
      <ReservationForm />
      <h2>FILTRO</h2>
      <div className='filter'>
        <label>Mes: </label>
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          min="1"
          max="12"
        />
        <label>Año: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <button onClick={fetchData}>Update Data</button>
      </div>
      {/* Profits Display */}
      <PastReservations reservations={pastReservations} />
      <Expenses month={month} year={year} />
      <Payments month={month} year={year} />

      {/* Filter Profits by Month and Year */}

      {/* Pass the month and year as props */}
    </div>
  );
};

export default App;
