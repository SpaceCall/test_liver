import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import "./passport.js";
import { dbConnect } from "./mysql";
import { meRoutes, authRoutes } from "./routes";
import path from "path";
import * as fs from "fs";
import cron from "node-cron";
import { userModel } from "./schemas/user.model";
import { patientModel } from "./schemas/patient.model";
import { users_patientsModel } from "./schemas/users_patients.model";
userModel.sync().then(()=>{
  const admin = userModel. findOrCreate({where:
  { Name: "admin", Email: "doctor@doctor", Password: "doctor",
  Type: "doctor", Department: "hospital1", Position: "doctor"}});
});
patientModel.sync();
users_patientsModel.sync();

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

const whitelist = [process.env.APP_URL_CLIENT];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use("/",express.static(path.join(fs.realpathSync("."),'/src/landing')))
//app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({ type: "application/vnd.api+json", strict: false }));




app.get("/", function (req, res) {
  const __dirname = fs.realpathSync(".");
  res.sendFile(path.join(__dirname, "/src/landing/index.html"));
});
app.get("/signin", function (req, res) {
  const __dirname = fs.realpathSync(".");
  res.sendFile(path.join(__dirname, "/src/landing/signin.html"));
});



app.use("/", authRoutes);
app.use("/", meRoutes);


app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
