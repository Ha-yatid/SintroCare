const express = require('express');
const passport = require('passport');
const {token, logout, verifyEmail,requestPasswordReset, resetPassword  } = require('../controllers/authController');
const { authenticateToken, verifyRole, authLimiter } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/token', token);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);


router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
    (req, res) => {
        res.redirect('/auth/protected');
    }
);

router.get('/auth/google/failure', (req, res) => {
    res.send('Something went wrong!');
});

router.get('/auth/protected', authenticateToken, (req, res) => {
    let name = req.user.displayName;
    res.send(`Hello ${name}!`);
});


router.get('/protected', authenticateToken, (req, res) => {
    res.send(`Welcome ${req.user.role}`);
});


router.get('/admin', authenticateToken, verifyRole('admin'), (req, res) => {
    res.send('Welcome Admin');
});

router.get('/user', authenticateToken, verifyRole('user'), (req, res) => {
    res.send('Welcome User');
});

module.exports = router;
