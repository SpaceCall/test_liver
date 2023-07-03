//import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { userModel } from "../../schemas/user.model.js";
import { patientModel } from "../../schemas/patient.model.js";
import { users_patientsModel } from "../../schemas/users_patients.model.js";
import { analyzesModel } from "../../schemas/analyzes.model.js";
import { Op } from "sequelize";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from "path";
import {PythonShell} from "python-shell";

dotenv.config();

export const getProfileRouteHandler = (req, res) => {
  const meUser = req.user;

  const stringId = req.user.id;
  const decId = stringId.substring(4, 8);
  const intId = parseInt(decId, 16);

  const sentData = {
    data: {
      type: 'users',
      id: intId === 1 ? intId : meUser.id,
      attributes: {
        name: meUser.name,
        email: meUser.email,
        profile_image: null,
        createdAt: meUser.createdAt,
        updateAt: meUser.updateAt
      },
      links: {
        self: `${process.env.APP_URL_API}/users/${meUser.id}`
      }
    }
  }
  res.send(sentData);
}

export const patchProfileRouteHandler = async (req, res) => {
  /*
  const currentDataOfUser = req.user;
  const { name, email, newPassword, confirmPassword } = req.body.data.attributes;
  const foundUser = await userModel.findOne({ email: currentDataOfUser.email});

  if (!foundUser) {
    res.status(400).json({error: 'No user matches the credentials'});
  } else {
    // check password more than 8 characters, new password matched the password confirmation
    if (newPassword && newPassword < 7 || newPassword != confirmPassword) {
      res.status(400).json({errors: { password: ["The password should have at lest 8 characters and match the password confirmation."] }});
    } else if (newPassword && newPassword > 7 && newPassword == confirmPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
      try{
        await userModel.updateOne( { email: foundUser.email }, { $set :{ "name": name, "email": email, "password": hashPassword } });
      } catch(err) {
        console.error(err);
      }
      const sentData = {
        data: {
          type: 'users',
          id: foundUser.id,
          attributes: {
            name: name,
            email: email,
            profile_image: null,
          }
        }
      }
      res.send(sentData);
    } else if (!newPassword) {
      try {
        await userModel.updateOne( { email: foundUser.email }, { $set :{ "name": name, "email": email } });
      } catch(err) {
        console.error(err);
      }
      const sentData = {
        data: {
          type: 'users',
          id: foundUser.id,
          attributes: {
            name: name,
            email: email,
            profile_image: null,
          }
        }
      }
      res.send(sentData);
    }
  }
  */

}

export const getPatientsRouteHandler = async (req, res) => {
  let id = req.body.id;
  let names = [];
  let ids = [];

  await users_patientsModel.findAll({
    where:
        {Users_id: id},
    attributes:['Patients_id'],
    raw:true
  }).then(patients=>{
    let a = [];
    for(let i=0;i<patients.length;i++){a.push(patients[i].Patients_id)}
    patientModel.findAll({
      where:
          {Patients_id:{
                [Op.or]:a}},
      attributes:['Patients_id','Name'],
      raw:true
    }).then(data=>{
      console.log(data);
      res.send(data);
    });
  });



}

export const createPatientRouteHandler = async (req, res) => {
  let name = req.body.name;
  let age = req.body.age;
  let height = req.body.height;
  let weight = req.body.weight;
  let doctor_id = req.body.doctor;

  let patient = await patientModel.create({ Name: name,Age:age,Height:height,Weight:weight});
  await users_patientsModel.create({ Users_id:doctor_id, Patients_id:patient.Patients_id});
  let answer ={id:patient.Patients_id};
  res.send(answer);
}

export const changePatientRouteHandler = async (req, res) => {
  let patient_id = req.body.patient_id;
  let what_change = req.body.change;
  if(what_change == "name") {
    let data = req.body.name;
    await patientModel.update({Name: data}, {
      where: {
        Patients_id: patient_id
      }
    });
  }
  else if(what_change == "age") {
    let data = req.body.age;
    await patientModel.update({Age: data}, {
      where: {
        Patients_id: patient_id
      }
    });
  }
  else if(what_change == "height") {
    let data = req.body.height;
    await patientModel.update({Height: data}, {
      where: {
        Patients_id: patient_id
      }
    });
  }
  else if(what_change == "weight") {
    let data = req.body.weight;
    await patientModel.update({Weight: data}, {
      where: {
        Patients_id: patient_id
      }
    });
  }
}

export const getPatientRouteHandler = async (req, res)=>{
  let patient_id = req.body.patient_id;
  patientModel.findOne({
    where:
        {Patients_id: patient_id},
    attributes:['Name','Age','Height','Weight'],
    raw:true
  }).then(patient=>{
    res.send(patient);
  });
}
export const uploadImgRouteHandler = async (req, res)=>{
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log("problem");
  let patient_id = req.body.patient_id;
  console.log(patient_id);
  let doctor_id = req.body.doctor_id;
  console.log(doctor_id);
  let type = req.body.type;
  console.log(req.file);
  let dirname = fs.realpathSync(".");
  let originalFileName = req.file.originalname;
  let fileExtension = path.extname(originalFileName);
  let fileName = `${Date.now() + '-' + Math.round(Math.random() * 1E9)}.${fileExtension}`;
  if (!fs.existsSync(path.join(dirname,'imagesdb',doctor_id,patient_id,'originals'))){
    fs.mkdirSync(path.join(dirname,'imagesdb',doctor_id,patient_id,'originals'), { recursive: true });
  }
  if (!fs.existsSync(path.join(dirname,'imagesdb',doctor_id,patient_id,'analyzedImages'))){
    fs.mkdirSync(path.join(dirname,'imagesdb',doctor_id,patient_id,'analyzedImages'), { recursive: true });
  }
  fs.renameSync(req.file.path, path.join(dirname,'imagesdb',doctor_id,patient_id,type,fileName));
  //fs.renameSync(req.file.path, path.join(dirname,'imagesdb',doctor_id,patient_id,`${type}`,`${req.file.originalname}`));

  return res.json({ message: 'File uploaded successfully' });

}
export const uploadImgRouteHandler2 = async (req, res)=>{
  console.log("problem");
  let patient_id = req.body.patient_id;
  console.log(patient_id);
  let doctor_id = req.body.doctor_id;
  console.log(doctor_id);
  let type = req.body.type;
  let dirname = fs.realpathSync(".");
  let Image_path = path.join(dirname,'imagesdb',doctor_id,patient_id,`${type}`,`${timeStamp}.png`);
  let dir = path.join(dirname,'imagesdb',doctor_id,patient_id,`${type}`);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  let file = req.file;
  //console.log(file);
  fs.writeFile(Image_path, file, (err) => {
    if (err) {
      console.error('An error occurred while saving the file:', err);
      res.sendStatus(500);
    } else {
      console.log('File saved successfully.');
      res.sendStatus(200);
    }
  });

}
export const uploadImgRouteHandlerOld = async (req, res)=>{
  let patient_id = req.body.patient_id;
  let doctor_id = req.body.doctor_id;
  let type = req.body.type;

  let dirname = fs.realpathSync(".");
  let Image_path = path.join(`${dirname}/imagesdb/${doctor_id}/${patient_id}/${Date.now()}.png`);
  let base64String = req.body.image;
  let base64Image = base64String.split(';base64,').pop();
  var dir = `${__dirname}/imagesdb/${doctor_id}/${patient_id}/`;

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFile(Image_path, base64Image, {encoding: 'base64'}, function(err) {

  });
}
export const analyzeRouteHandler = async (req, res)=>{
  let id = req.body.id;
  const dirname = fs.realpathSync(".");
  let patient_id = req.body.patient_id;
  let directoryPath = path.join(`${dirname}/imagesdb`, `${id}`, `${patient_id}`);
  let files = fs.readdirSync(directoryPath);
  let analyze="";
  console.log(files);
  console.log(directoryPath);
  for(let i=0;i<files.length;i++)
  {
    files[i] = `${dirname}/imagesdb/${id}`+`/${patient_id}`+`/${files[i]}`;
  }
  //files.forEach((elem)=>{elem = __dirname+`/${id}`+ `/${patient_id}`+`/${elem}`});
  console.log(files[0]);
  let task_data = req.body.task;
  let base64String = req.body.image;
  let base64Image = base64String.split(';base64,').pop();
  let python_path = path.join(`${dirname}`, `SystemBack`, `pythonfile.py`);
  //let originalFileName = req.file.originalname;
  //let fileExtension = path.extname(originalFileName);
  let filename = `${Date.now() + '-' + Math.round(Math.random() * 1E9)}.png`;
  let Image_path = path.join(dirname,`imagesdb`,`${id}`,`${patient_id}`,`analyzedImages`,filename);
  fs.writeFile(Image_path, base64Image, {encoding: 'base64'}, function(err) {

  });
  PythonShell.run(path.join(`${dirname}`, `SystemBack`, `pythonfile.py`), {args:[Image_path,task_data]}).then(messages=>{
    analyze = messages[0];
    analyzesModel.create({ Patient_id: patient_id,FileName: filename, Analysis: analyze});
    res.send({task: task_data,answer:analyze});
  });
}
