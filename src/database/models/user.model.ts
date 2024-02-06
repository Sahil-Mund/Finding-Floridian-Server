/* eslint-disable import/no-extraneous-dependencies */
import { DataTypes, Optional, Model, UUIDV4 } from "sequelize";
import sequelize from "../../configs/db.config";
import bcrypt from "bcrypt";
import "dotenv/config";

export enum UserType {
  admin = "ADMIN",
  user = "USER",
}
export interface UserAttributes {
  id?: string;
  name?: string;
  email: string;
  password?: string;
  role?: string;
  phone_number: string;
}

interface UserInstance
  extends Model<UserAttributes>,
    UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const User = sequelize.define<UserInstance>("User", {
  id: {
    allowNull: false,
    unique: true,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
  },
  name: { type: DataTypes.STRING, allowNull: true },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: { type: DataTypes.STRING, allowNull: false },
  phone_number: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM({
      values: Object.values(UserType),
    }),
    defaultValue: UserType.user,
  },
});

User.beforeCreate((user, options) => {
  return bcrypt
    .hash(user.password, Number(process.env.SALT_ROUNDS))
    .then((hash) => {
      user.password = hash;
    })
    .catch((err) => {
      throw new Error(err);
    });
});

export default User;
