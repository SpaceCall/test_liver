import {DataTypes } from "sequelize";
import { dbConnect } from "../mysql/index.js";

const _liverAnalyzesModel = dbConnect.define("liverAnalyzes", {
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
    FileName: {
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

_liverAnalyzesModel.sync();

export const liverAnalyzesModel = dbConnect.models.liverAnalyzes;
