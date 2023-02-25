// Import rate-limit package
const rateLimit = require('express-rate-limit');

// Login/Signup rules
const limiter = rateLimit({
  max: 10, // Block after 10 requests
  windowMs: 20 * 60 * 1000, // 20 minutes
  message: "Revenez plus tard"
});

module.exports = limiter;