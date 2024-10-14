const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "geoguard",
})

app.get('/', (request, response) => {
    return response.json("Starting the NODE SERVER...")
})

app.listen(8081, () => {
    console.log("GeoGuard Launching...")
})

app.post('/register', (request, response) => {
    const { firstName, lastName, email, password } = request.body;

    // Check if the email already exists
    const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailSql, [email], (checkError, checkResult) => {
        if (checkError) {
            return response.status(500).send('Database error');
        }
        
        if (checkResult.length > 0) {
            // If email exists, send a 400 response with a specific error message
            return response.status(400).send('Email already exists');
        }

        const sql = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [firstName, lastName, email, password], (error, result) => {
            if (error) throw error;
            response.send('Registration Successful');
        });
    });
});



