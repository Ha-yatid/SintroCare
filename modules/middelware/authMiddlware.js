const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');


//console.log(process.env.ACCESS_TOKEN_SECRET);
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
    
    //console.log("accesstoken :",req.cookies.accessToken )
    const token = req.cookies.accessToken //|| req.headers['authorization']?.split(' ')[1];
    //console.log("Token:", token);
    
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        //console.log("user  ", user);
        next();
    });
};

/*const verifyRole = (role) => {
    return (req, res, next) => {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ message: 'Access denied' });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });
            console.log("Decoded Token 403:", decoded);
            
            if (decoded.role !== role) {
                return res.status(403).json({ message: `Access denied for ${role}s` });
            }
            //req.user = decoded;
            console.log("Decoded Token 200:", decoded);

            req.user = {
                _id: decoded.id,  // Récupérer PatientId du token
                role: decoded.role,
              };
            console.log("USER ", req.user)
            next();
        });
    };
};
*/

const verifyRole = (role) => {
    return (req, res, next) => {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ message: 'Access denied' });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });
            
            // Assurez-vous que l'ID est correctement défini
            if (decoded.role !== role) {
                return res.status(403).json({ message: `Access denied for ${role}s` });
            }
            
            req.user = {
                _id: decoded.id,
                role: decoded.role,
            };
            // console.log("USER dans verifyRole:", req.user); // Vérification de `req.user`
            next();
        });
    };
};


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many login attempts. Please try again later.' });
    },
    skipSuccessfulRequests: true
});

module.exports = {
    authenticateToken,
    verifyRole,
    authLimiter
};
