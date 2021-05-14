const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config();

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.DB,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then (() => console.log("Connexion a MongoDB réussie !"))
    .catch (() => console.log("Connexion a MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});


app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;