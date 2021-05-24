const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async (req, res, next) => {
    let passwordHashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        email: req.body.email,
        password: passwordHashed
    })
    console.log(user);
    user.save()
    .then (()=> res.status(201).json({ message: "Utilisateur crée !"}))
    .catch(error => res.status(500).json({ error }));
};

exports.login = async (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            res.status(401).json({ error: "Utilisateur introuvable" })
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                res.status(401).json({ error: "Mot de passe incorrect" })
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "24h"},
                )
            })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};