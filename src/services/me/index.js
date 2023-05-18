//import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { userModel } from "../../schemas/user.model";
import { patientModel } from "../../schemas/patient.model";
import { users_patientsModel } from "../../schemas/users_patients.model";
import { Op } from "sequelize";
import jwt from 'jsonwebtoken';
import fs from 'fs';

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
  let patient_id = req.body.patient_id;

  const __dirname = fs.realpathSync(".");
  let doctor_id = req.body.doctor_id;
  let date = Date.now();
  let Image_path = (`${__dirname}/imagesdb/${doctor_id}/${patient_id}/${date}.png`);
  let base64String = req.body.image;
  let base64Image = base64String.split(';base64,').pop();
  var dir = `${__dirname}/imagesdb/${doctor_id}/${patient_id}/`;
  console.log("yes");
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFile(Image_path, base64Image, {encoding: 'base64'}, function(err) {

  });
}
