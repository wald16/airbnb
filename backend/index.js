const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Leianetflix16',
    database: 'airbnb',
});

db.getConnection((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// Get profits
app.get('/profits', (req, res) => {
    const { month, year } = req.query;
    const query = `
      SELECT * FROM Profits 
      WHERE Month = ? AND Year = ?`;

    db.query(query, [month, year], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Add reservation
app.post('/reservations', (req, res) => {
    const { PropertyID, StartDate, EndDate, TotalAmount, GuestName, Status } = req.body;

    if (!StartDate || !EndDate || !TotalAmount || !GuestName) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
      INSERT INTO Reservations (PropertyID, StartDate, EndDate, TotalAmount, GuestName, Status) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [PropertyID, StartDate, EndDate, TotalAmount, GuestName, Status], (err) => {
        if (err) return res.status(500).json({ error: 'Error inserting reservation' });
        res.status(201).json({ message: 'Reservation added successfully' });
    });
});

// Get past reservations
app.get('/past-reservations', (req, res) => {
    const { month, year } = req.query;
    let query = `
        SELECT * FROM Reservations
        WHERE MONTH(StartDate) = ? AND YEAR(StartDate) = ?`;


    query += ` ORDER BY EndDate DESC`;

    db.query(query, [month, year], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.get('/expenses', (req, res) => {
    const { month, year } = req.query;
    const query = `
        SELECT * FROM Expenses 
        WHERE MONTH(Date) = ? AND YEAR(Date) = ?`;

    db.query(query, [month, year], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.post('/expenses', (req, res) => {
    const { Date, Amount, Category, Description } = req.body;
    const query = `
        INSERT INTO Expenses (Date, Amount, Category, Description)
        VALUES (?, ?, ?, ?)`;

    db.query(query, [Date, Amount, Category, Description], (err) => {
        if (err) return res.status(500).json({ error: 'Error adding expense' });
        res.status(201).json({ message: 'Expense added successfully' });
    });
});

app.get('/payments', (req, res) => {
    const { month, year } = req.query;
    const query = `
        SELECT p.PaymentID, p.Date, p.Amount, r.ReservationID, r.GuestName, r.StartDate, r.EndDate 
        FROM Payments p
        INNER JOIN Reservations r ON p.ReservationID = r.ReservationID
        WHERE MONTH(p.Date) = ? AND YEAR(p.Date) = ?`;

    db.query(query, [month, year], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});


app.post('/payments', (req, res) => {
    const { ReservationID, Date, Amount } = req.body;

    // Validate required fields
    if (!ReservationID || !Date || !Amount) {
        return res.status(400).json({ error: 'ReservationID, Date, and Amount are required' });
    }

    // SQL query to insert the payment record
    const query = `
        INSERT INTO Payments (ReservationID, Date, Amount)
        VALUES (?, ?, ?)`;

    db.query(query, [ReservationID, Date, Amount], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error adding payment' });
        }

        // After payment is added, update reservation status to 'confirmed'
        const updateQuery = `
            UPDATE Reservations
            SET Status = 'confirmed'
            WHERE ReservationID = ?`;

        db.query(updateQuery, [ReservationID], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ error: 'Error updating reservation status' });
            }

            res.status(201).json({ message: 'Payment added successfully and reservation confirmed' });
        });
    });
});
// Update reservation status
app.patch('/reservations/:id', (req, res) => {
    const { id } = req.params;
    const { Status } = req.body;

    if (!Status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    const query = `
        UPDATE Reservations
        SET Status = ?
        WHERE ReservationID = ?`;

    db.query(query, [Status, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating reservation status' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        res.status(200).json({ message: 'Reservation status updated successfully' });
    });
});





app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
