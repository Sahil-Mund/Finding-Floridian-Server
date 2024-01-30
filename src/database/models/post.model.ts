import { DataTypes, Model } from "sequelize";
import sequelize from "../../configs/db.config";
import { UUIDV4 } from "sequelize";

export interface PostAttributes {
  id?: string;
  title: string;
  body: string;
  embedding?: number[]; // Assuming embedding is an array of numbers
}

const Post = sequelize.define<Model<PostAttributes>>(
  "posts",
  {
    id: {
      allowNull: false,
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    embedding: {
      type: DataTypes.ARRAY(DataTypes.DOUBLE), // Vector Type
      allowNull: true,
    },
  },
  {
    timestamps: false, // Disable the automatic creation of createdAt and updatedAt fields
  }
);

export default Post;
