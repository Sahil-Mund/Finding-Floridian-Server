import sequelize from "../configs/db.config";
import User from "./models/user.model";

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error : Error) => {
    console.error("Unable to connect to the database:", error);
  });

//sync all tables/models
User.sync();

