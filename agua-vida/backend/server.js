require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = require('cors');
require('./passport-setup'); // Sets up the Google OAuth strategy

const authRoutes = require('./routes/auth');
const taskListRoutes = require('./routes/taskLists');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow frontend to make requests
  credentials: true,
}));

app.use(cookieSession({
  name: 'agua-vida-session',
  keys: [process.env.COOKIE_KEY || 'some-secret-key-for-dev'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api', taskListRoutes);

app.get('/', (req, res) => {
  res.send('Água Vida Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
