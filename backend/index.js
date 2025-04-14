const express= require("express")
const app =express()
const bodyParser= require("body-parser")
const cors =require("cors")
const path = require('path');
require("dotenv").config();

const routes = require("./routes/routes")
app.listen(3000,()=>{
    console.log("server is running on pot 3000")
})

// Servir les fichiers statiques du dossier "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const corsOptions = {
    origin: 'http://localhost:4200', // Assure-toi que ton frontend tourne sur le bon port
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

// Configuration des middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/api',routes)


module.exports = app;
