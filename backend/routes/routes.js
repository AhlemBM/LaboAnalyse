const express = require("express");
const authCtrl = require("../controllers/authCtrl");
const userCtrl=require("../controllers/userCtrl")

const testController = require("../controllers/testCtrl");
const resultatCtrl = require("../controllers/resultatCtrl");
const rendezvousCtrl = require('../controllers/rendez_vousCtrl');
const kitController = require('../controllers/kitCtrl');
const panierController = require('../controllers/panierCtrl');
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour l'upload des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Dossier où les fichiers seront stockés
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Création d'un nom de fichier unique
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

//auth routes
router.post("/register", authCtrl.register);
router.post("/login",authCtrl.login)

//user routes
router.get("/profile/:id",userCtrl.getProfile)
router.get("/user/getAll", userCtrl.getAllUsers);
router.delete("/user/delete/:id", userCtrl.deleteUser);

// test routes
router.post("/test/add", testController.addTest);
router.delete("/test/delete/:id", testController.deleteTest);
router.get("/test/all", testController.getAllTests);
router.get("/test/name/:nom", testController.getTestByName);
router.get("/test/id/:id", testController.getTestById);
router.put("/test/update/:id", testController.updateTest);

//resultat routes
router.post("/resultat/add", resultatCtrl.addResultat);
router.get("/resultat/all", resultatCtrl.getAllResultats);
router.get("/resultat/get/:id", resultatCtrl.getResultatById);
router.get("/resultat/getByUser/:patientId", resultatCtrl.getResultatsByUserId);
router.get("/resultat/download/:id", resultatCtrl.downloadanalyse);
router.delete("/resultat/delete/:id", resultatCtrl.deleteResultat);


//rendez-vous routes
router.post("/rendezvous/create", rendezvousCtrl.createRendezvous);
router.get("/rendezvous/all", rendezvousCtrl.getAllRendezvous);
router.get("/rendezvous/:id", rendezvousCtrl.getRendezvousById);
router.get("/rendezvous/patient/:numTel", rendezvousCtrl.getRendezvousByPatient);
router.put("/rendezvous/update/:id", rendezvousCtrl.updateRendezvous);
router.delete("/rendezvous/delete/:id", rendezvousCtrl.deleteRendezvous);

//kits routes

router.post('/kits/add', upload.single('img'), kitController.createKit);
router.get('/kits/getAll', kitController.getAllKits)
router.get('/kits/get/:id', kitController.getKitById);
router.put('/kits/update/:id', upload.single('img'), kitController.updateKit);
router.delete('/kits/delete/:id', kitController.deleteKit);

// panier routes
router.post('/panier/add', panierController.addToCart);
router.get('/panier/get/:userId', panierController.getUserCart);
router.delete('/panier/remove/:id', panierController.removeFromCart);
router.delete('/panier/clear/:userId', panierController.clearCart);
router.put('/panier/update/:panierId', panierController.updateQuantity);
router.post('/panier/valider', panierController.validerCommande);




module.exports = router;
