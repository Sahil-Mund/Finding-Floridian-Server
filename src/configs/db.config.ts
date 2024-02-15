// eslint-disable-next-line import/no-extraneous-dependencies
import { Dialect, Sequelize } from "sequelize";
import * as pg from "pg";
import "dotenv/config";

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USERNAME as string;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  dialectModule: pg
});

export default sequelize;
