import {DataTypes } from "sequelize";
import { dbConnect } from "../mysql/index.js";

const _userModel = dbConnect.define("user", {
  Users_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataTypes.UUIDV4
  },
  Name: {
    type: DataTypes.STRING(300),
    unique: false,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING(45),
    unique: false,
    allowNull: false
  },
  Type: {
    type: DataTypes.STRING(45),
    unique: false,
    allowNull: false
  },
  IsOnline: {
    type: DataTypes.BOOLEAN,
    unique: false,
    defaultValue: 0,
    allowNull: false
  },
  LastLogin: {
    type: DataTypes.DATE,
    unique: false,
    allowNull: true
  },
  Department: {
    type: DataTypes.STRING(45),
    unique: false,
    allowNull: false
  },
  Position: {
    type: DataTypes.STRING(45),
    unique: false,
    allowNull: false
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    unique: false,
    allowNull: false
  },
  DeletedDate: {
    type: DataTypes.DATE,
    unique: false
  }

},{tableName: 'users'});

_userModel.sync();
//const Danylo = await _userModel.create(
    //{ Name: "Danylo", Email: "admin@admin", Password: "admin",
     //Type: "doctor", Department: "hospital1", Position: "dev"});
//const Danylo_admin = await _userModel.create(
//    { Name: "Danylo", Email: "admin1@admin", Password: "admin",
//      Type: "admin", Department: "hospital1", Position: "dev"});

export const userModel = dbConnect.models.user;
