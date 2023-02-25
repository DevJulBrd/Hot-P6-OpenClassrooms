// Import model
const User = require('../models/user');

// Import packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create an user 
exports.signup = (req, res, next) => {
    // Hash password
    bcrypt.hash(req.body.password, 10)
    // Create a user on User
    .then((hash) => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // Save user in dataBase
        user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé et sauvegardé'}))
        .catch((error) => res.status(400).json({error}));
    })
    .catch((error) => res.status(500).json({error}));
};

// Login
exports.login = (req, res, next) => {
    // Find a user in User
    User
    .findOne({email: req.body.email})
    .then((user) => {
        // user doesn't existe
        if(!user){
            return res.status(401).json({error: "Email/Mot de passe incorrect"})
        } else {
            // Hash check
            bcrypt.compare(req.body.password, user.password)
            .then((valid) => {
                // Wrong password
                if(!valid){
                    return res.status(401).json({error: "Email/Mot de passe incorrect"})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            `${process.env.TOKEN}`,
                            {expiresIn: '12h'}
                        )
                    })
                }
            })
            .catch((error) => res.status(500).json({error}));
        }
    })
    .catch((error) => res.status(500).json({error}));
};
