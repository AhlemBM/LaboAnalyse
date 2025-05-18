const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();

const routes = require("./routes/routes");

const app = express();
const server = http.createServer(app); // Création du serveur HTTP à partir de Express

// 🔌 Socket.io
const io = socketIO(server, {
    cors: {
        origin: '*',
    },
});
app.set('io', io); // accessible dans les controllers

// 🔔 Gestion de la connexion Socket.io (par ex. pour debug)
io.on('connection', (socket) => {
    console.log('Client connecté via WebSocket');
});

// 📁 Middleware statique pour les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🌐 CORS configuration
const corsOptions = {
    origin: 'http://localhost:4200', // Remplace par ton domaine si déployé
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// 🛠️ Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🚏 Routes
app.use('/api', routes);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
