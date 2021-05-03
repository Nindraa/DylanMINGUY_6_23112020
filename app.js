const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

mongoose.connect("mongodb+srv://Nindraa:1234567890@cluster0.14t6w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then (() => console.log("Connexion a MongoDB réussie !"))
    .catch (() => console.log("Connexion a MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;