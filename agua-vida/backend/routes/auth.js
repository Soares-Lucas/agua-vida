const express = require('express');
const passport = require('passport');
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Route to start the Google authentication process
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Callback route that Google redirects to after user authenticates
router.get('/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    // Successful authentication, redirect to the frontend app.
    res.redirect(FRONTEND_URL);
  }
);

// Route for the frontend to check if a user is logged in
router.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

// Route to log out the user
router.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect(FRONTEND_URL);
});

module.exports = router;
