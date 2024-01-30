import { DataTypes, Model } from "sequelize";
import sequelize from "../../configs/db.config";
import { UUIDV4 } from "sequelize";
import "dotenv/config";

export interface QnaAttributes {
  id?: string;
  data: string;
  embedding: number[]; // Assuming embedding is an array of numbers
}

const QNANew = sequelize.define<Model<QnaAttributes>>(
  "qna_news",
  {
    id: {
      allowNull: false,
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },

    data: {
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

export default QNANew;
