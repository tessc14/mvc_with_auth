const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const bcrypt = require('bcrypt');


const countryRoutes = require('./routes/countries');
const db = require('./database/db');
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger('dev'));


app.get('/', (req, res) => res.send('Welcome to the real world'))

app.use('/countries', countryRoutes)

app.post('/users/register', async (req, res) => {
    const { username, password } = req.body
    
    if (!username || !password) {
        return res.status(400).send({ error: "Username and password are required" });
    }

    const duplicate = await db.query("SELECT * FROM users WHERE username = $1", [username]).rows;

    if (duplicate) {
        return res.status(409).json({ error: "user already exists" })
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const result = await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]
        )
        
        res.status(201).json({ success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

app.post('/users/login', async (req, res) => {
    const { username, password } = req.body
    
    if (!username || !password) {
        return res.status(400).send({ error: "Username and password are required" });
    }

    try {

        const search = await db.query("SELECT * FROM users WHERE username = $1", [username])
        const user = search.rows[0]

        if (!user) {
            res.status(401).json({ success: false, message: "Incorrect credentials" });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({succes: false, message: "Incorrect credentials"})
        }

        //add token and send to client

        res.json({ success: true, message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message})
    }

})


module.exports = app;