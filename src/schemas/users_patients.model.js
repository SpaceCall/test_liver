import {DataTypes } from "sequelize";
import { dbConnect } from "../mysql";

const _users_patientsModel = dbConnect.define("users_patients", {
    users_patients_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    Users_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    Patients_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
},{tableName: 'users_patients'});

_users_patientsModel.sync();

export const users_patientsModel = dbConnect.models.users_patients;