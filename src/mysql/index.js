import {Sequelize} from "sequelize";
import dotenv from "dotenv";

dotenv.config();


export const dbConnect = new Sequelize('liver_test', `${process.env.DB_USER}`, `${process.env.DB_PASSWORD}`, {
    host: `${process.env.DB_HOST}`,
    dialect: 'mysql',
    define: {
      timestamps: false
    }
  });




