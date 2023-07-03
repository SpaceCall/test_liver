import express from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import multer from 'multer';

import { getProfileRouteHandler, patchProfileRouteHandler, getPatientsRouteHandler,
  createPatientRouteHandler,changePatientRouteHandler,getPatientRouteHandler,uploadImgRouteHandler,analyzeRouteHandler } from "../../services/me/index.js";
import fs from "fs";
import path from "path";
import {PythonShell} from 'python-shell';
const upload = multer({ dest: path.join(fs.realpathSync("."),'imagesdb',`temporalStorage`) });

const router = express.Router();
const imagesPath = path.join(fs.realpathSync("."), 'imagesdb');
router.use(express.static(imagesPath));
// get user's profile
/*
router.get("/profile", passport.authenticate('jwt',{session: false}), (req, res) => {
  console.log("a");
  const __dirname = fs.realpathSync(".");
  res.sendFile(path.join(__dirname, "/src/landing/profile.html"));
  getProfileRouteHandler(req, res);
});*/
router.get("/profile",(req, res) => {
  const __dirname = fs.realpathSync(".");
  res.sendFile(path.join(__dirname, "/src/landing/profile.html"));
  //getProfileRouteHandler(req, res);
});
// update user's profile
/*
router.patch("/profile", passport.authenticate('jwt',{session: false}), async (req, res) => {
  patchProfileRouteHandler(req, res);
});*/
router.get("/patients",(req, res) => {
  const __dirname = fs.realpathSync(".");
  res.sendFile(path.join(__dirname, "/src/landing/patients.html"));
  //getProfileRouteHandler(req, res);
});
router.post("/patients/getPatients",(req, res) => {
  const __dirname = fs.realpathSync(".");
  getPatientsRouteHandler(req, res);
});
router.get("/patient",(req, res) => {
  const __dirname = fs.realpathSync(".");
  res.sendFile(path.join(__dirname, "/src/landing/patient.html"));
  //getProfileRouteHandler(req, res);
});
router.post("/patient/createPatient",(req, res) => {
  createPatientRouteHandler(req, res);
});
router.post("/patient/changePatientData",(req, res) => {
  changePatientRouteHandler(req,res);
});

router.post("/patient/getPatientData",(req, res) => {
  getPatientRouteHandler(req,res);
});
router.post('/patient/getOriginals', (req, res) => {
  let patient_id = req.body.patient_id;
  let doctor_id = req.body.doctor_id;
  fs.readdir(path.join(imagesPath,`${doctor_id}`,`${patient_id}`,'originals'), (err, files) => {
    const jsonData = JSON.stringify(files);
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonData);
  });

});
router.post('/patient/getAnalyzed', (req, res) => {
  let patient_id = req.body.patient_id;
  let doctor_id = req.body.doctor_id;
  fs.readdir(path.join(imagesPath,`${doctor_id}`,`${patient_id}`,'analyzedImages'), (err, files) => {
    const jsonData = JSON.stringify(files);
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonData);
  });

});
router.post("/patient/upload-photo", upload.single('file'),(req, res) => {
  uploadImgRouteHandler(req,res);
});
router.post('/patient/analyze',(req, res) => {

  analyzeRouteHandler(req,res);

});
export default router;
