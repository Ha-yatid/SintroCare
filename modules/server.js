const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const cors = require('cors');


const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Allow only the React app
    credentials: true
}));

require('./auth');
require('dotenv').config();

// Connect to the database
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

// Session management
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' ? true : false }
}));

// Initialize Passport.js for authentication
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res,next){
    req.user ? next() : res.sendStatus(401);
}


// Define Routes without const
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/', require('./routes/authRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));
app.use('/api/Analyses', require('./routes/analysisRoutes'));
app.use('/api/DosageEntry', require('./routes/userDosageRoutes'));
app.use('/api/Shedules', require('./routes/scheduleRoutes'));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
    })
);

app.get('/auth/google/failure', isLoggedIn, (req, res) => {
    res.send('Something went wrong!');
});

app.get('/auth/protected', isLoggedIn, (req, res) => {
    let name = req.user.displayName;
    res.send(`Hello ${name}!`);
});

app.get('/', (req, res) => {
    console.log('Request received for /');
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
    console.log('Response sent for /');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;

