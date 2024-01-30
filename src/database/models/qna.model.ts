import { DataTypes, Model } from "sequelize";
import sequelize from "../../configs/db.config";
import { UUIDV4 } from "sequelize";
import "dotenv/config";

export interface QnaAttributes {
  id?: string;
  question: string;
  answer: string;
  embeddings?: number[]; // Assuming embedding is an array of numbers
}

const QNA = sequelize.define<Model<QnaAttributes>>(
  "qna",
  {
    id: {
      allowNull: false,
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    embeddings: {
      type: DataTypes.ARRAY(DataTypes.DOUBLE), // Vector Type
      allowNull: true,
    },
  },
  {
    timestamps: false, // Disable the automatic creation of createdAt and updatedAt fields
  }
);

export default QNA;
