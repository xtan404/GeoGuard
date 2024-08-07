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
    database: "",
})

app.get('/', (request, response) => {
    return response.json("Starting the NODE SERVER...")
})

app.listen(8081, () => {
    console.log("Listening")
})
