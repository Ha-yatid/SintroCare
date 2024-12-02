const jwt = require('jsonwebtoken');
const config = require('../config/db');
const nodemailer = require('nodemailer');
const UserDoctor = require('../models/UserDoctor');
const UserPatient = require('../models/UserPatient');

// Generate Access Token
const generateAccessToken = (user) => {
  //console.log("generateaccestoken   ",user._id);
  const payload = {
    id: user._id,
    role: user.role, 
  };
  return jwt.sign( payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role, 
  };
  return jwt.sign( payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// Verify Token Middleware
/*const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};*/

/*const authenticateToken = (req, res, next) => {
  console.log("Cookies:", req.cookies); // Log all cookies
  const token = req.cookies?.accessToken; // Retrieve accessToken directly
  
  if (!token) {
      console.log("Access token not found in cookies");
      return res.sendStatus(401); // Unauthorized
  }
  
  jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
          console.log("Token verification error:", err.message);
          return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
  });
};*/
// Refresh Token Endpoint
/*const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.headers['authorization']?.split(' ')[1];
  if (!refreshToken) return res.status(403).json({ message: 'No refresh token provided' });

  jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const accessToken = generateAccessToken({ userName: user.userName, role: user.role });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.json({ accessToken });
  });
};*/

// Send Email for Login Notification or Verification
const sendLoginNotification = async (user) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change to any email provider
    auth: {
      user:process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Login Notification',
    text: `Hello ${user.fullName}, you've logged into your account. If this wasn't you, please reset your password.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Login notification email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Send Verification Email
const sendVerificationEmail = async (user, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Email Verification',
    text: `Hello ${user.fullName}, please verify your email by using the following code: ${verificationCode}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserPatient.findOne({ email }) || await UserDoctor.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 heure à partir de maintenant
        await user.save();

        sendPasswordResetEmail(user, resetToken);

        res.send('Password reset email sent.');
    } catch (err) {
        res.status(500).send(err.message);
    }
};
const sendPasswordResetEmail = (user, resetToken) => {
  const resetLink = `https://localhost:3000/reset-password?token=${resetToken}&email=${user.email}`;
  
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
      
  };
  
  transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
          console.error('Error sending email:', err);
          return;
      }
      console.log('Email sent:', info.response);
  });
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        const user = await UserPatient.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }) || 
                     await UserDoctor.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).send('Invalid or expired token');
        }
        user.password = await bcrypt.hash(newPassword, 8);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.send('Password reset successful');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Fonction pour gérer les tokens
const token = (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).send('Refresh token required');
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).send('Invalid refresh token');
        }
        jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
            if (err) {
                return res.status(403).send('Invalid refresh token');
            }
            const accessToken = generateAccessToken({ username: user.username, role: user.role });
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
            res.json({ accessToken });
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send(err.message);
    }
};
const verifyEmail = async (req, res) => {
    try {
        const { email, code, accountType } = req.body;
        if (accountType === 'doctor') {
          user = await UserDoctor.findOne({ email });
        } else {
          user = await UserPatient.findOne({ email });
        }
        if (!user) {
            return res.status(400).send('User not found');
        }

        if (user.emailVerificationCode !== code) {
            return res.status(400).send('Invalid verification code');
        }
        
        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;

        await user.save();
        res.send('Email verified successfully');
    } catch (err) {
      
      console.error(err);
        res.status(500).send(err.message);
    }
};


// Logout and Clear Tokens
const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    //authenticateToken,
    //refreshToken,
    sendLoginNotification,
    sendVerificationEmail,
    logout,
    token,
    verifyEmail,
    requestPasswordReset,
    resetPassword
};

