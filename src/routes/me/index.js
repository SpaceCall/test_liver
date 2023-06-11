import express from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';

const router = express.Router();
import { getProfileRouteHandler, patchProfileRouteHandler, getPatientsRouteHandler,
  createPatientRouteHandler,changePatientRouteHandler,getPatientRouteHandler,uploadImgRouteHandler } from "../../services/me/index.js";
import fs from "fs";
import path from "path";
import {PythonShell} from 'python-shell';

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
router.post("/patient/upload-photo",(req, res) => {
  uploadImgRouteHandler(req,res);
});
router.post('/patient/analyze',(req, res) => {
  let id = req.body.id;
  const __dirname = fs.realpathSync(".");
  let patient_id = req.body.patient_id;
  let directoryPath = path.join(`${__dirname}/imagesdb`, `${id}`, `${patient_id}`);
  let files = fs.readdirSync(directoryPath);
  let analyze="";
  console.log(files);
  console.log(directoryPath);
  for(let i=0;i<files.length;i++)
  {
    files[i] = `${__dirname}/imagesdb/${id}`+`/${patient_id}`+`/${files[i]}`;
  }
  //files.forEach((elem)=>{elem = __dirname+`/${id}`+ `/${patient_id}`+`/${elem}`});
  console.log(files[0]);
  let task_data = req.body.task;
  let Image_path = (`${__dirname}/imagesdb/${id}/${patient_id}/`);
  let base64String = req.body.image;
  let base64Image = base64String.split(';base64,').pop();
  fs.writeFile(Image_path+"1.png", base64Image, {encoding: 'base64'}, function(err) {

  });
  PythonShell.run(`${__dirname}/SystemBack/pythonfile.py`, {args:[files[0],task_data]}).then(messages=>{
    analyze = messages[0];
    res.send({task: task_data,answer:analyze});
  });


});
export default router;
