const express = require("express");
const authCtrl = require("../controllers/authCtrl");
const userCtrl=require("../controllers/userCtrl")

const testController = require("../controllers/testCtrl");
const resultatCtrl = require("../controllers/resultatCtrl");
const rendezvousCtrl = require('../controllers/rendez_vousCtrl');

const router = express.Router();
//auth routes
router.post("/register", authCtrl.register);
router.post("/login",authCtrl.login)

//user routes
router.get("/profile/:id",userCtrl.getProfile)
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
router.get("/rendezvous/patient/:patientId", rendezvousCtrl.getRendezvousByPatientId);
router.put("/rendezvous/update/:id", rendezvousCtrl.updateRendezvous);
router.delete("/rendezvous/delete/:id", rendezvousCtrl.deleteRendezvous);


module.exports = router;
