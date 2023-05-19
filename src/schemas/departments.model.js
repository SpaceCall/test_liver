import {DataTypes } from "sequelize";
import { dbConnect } from "../mysql/index.js";

const _departmentsModel = dbConnect.define("department", {
    Departments_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    Name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
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
},{tableName: 'departments'});

_departmentsModel.sync();

export const departmentsModel = dbConnect.models.department;
