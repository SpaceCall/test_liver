import {DataTypes } from "sequelize";
import { dbConnect } from "../mysql";

const _patientModel = dbConnect.define("patient", {
    Patients_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    Name: {
        type: DataTypes.STRING(300),
        unique: false,

    },
    Age: {
        type: DataTypes.INTEGER,
        unique: false,

    },
    Height: {
        type: DataTypes.DOUBLE,
        unique: false,

    },
    Weight: {
        type: DataTypes.DOUBLE,
        unique: false,

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

},{tableName: 'patients'});

_patientModel.sync();



export const patientModel = dbConnect.models.patient;
