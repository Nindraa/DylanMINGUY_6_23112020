const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
var Buffer = require('buffer/').Buffer;

exports.signup = (req, res, next) => {
    let email = Buffer.from(req.body.email, "utf8");
    let emailEncoded = email.toString("base64");
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: emailEncoded,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: "Nouvel utilisateur crée !" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }))
};

exports.login = (req, res, next) => {
    let email = Buffer.from(req.body.email, "utf8");
    let emailEncoded = email.toString("base64");
    User.findOne({ email: emailEncoded})
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
                    "NEW_RANDOM_TOKEN",
                    { expiresIn: "24h"},
                )
            })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};