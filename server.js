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
});

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

//login
app.post("/login", (request, response) => {
  const { email, password, role } = request.body;
  const sql = "SELECT user_id, firstName, role FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password, role], (error, data) => {
    if (error) {
      console.error("Error during login:", error);
      return response.json({
        success: false,
        error: "An error occurred. Please try again later.",
      });
    }

    if (data.length > 0) {
      const { user_id, firstName, role } = data[0];
      return response.json({ success: true, user_id, firstName, role });
    } else {
      return response.json({
        success: false,
        error: "Invalid credentials. Please try again.",
      });
    }
  });
});

app.post('/login', (request, response) => {
    const sql = "SELECT FROM users WHERE email = ? AND password = ?"
    db.query(sql, [request.body.email, request.body.password], (error, result) => {
        if (error) return response.json({ Message: "Error inside server" })
        if (result.length > 0) {
            request.session.role = result[0].role
            return response.json({Login: true})
        } else {
            return response.json({Login: false})
        }
    })
})