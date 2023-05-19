import {DataTypes } from "sequelize";
import { dbConnect } from "../mysql/index.js";

const _analyzesModel = dbConnect.define("analysis", {
    Analyzes_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    Patient_id: {
        type: DataTypes.UUID,
        unique: false,
        allowNull: false
    },
    Analysis: {
        type: DataTypes.STRING(400),
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
},{tableName: 'analyzes'});

_analyzesModel.sync();

export const analyzesModel = dbConnect.models.analysis;
