/* eslint-disable import/no-extraneous-dependencies */
import { DataTypes, Optional, Model, UUIDV4 } from "sequelize";
import sequelize from "../../configs/db.config";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UUID } from "crypto";

export interface PropertyEmbeddingsAttributes {
    id: UUID;
    property_id: UUID;
    embeddings: number[];
}

interface PropertyEmbeddingsInstance
    extends Model<PropertyEmbeddingsAttributes>,
    PropertyEmbeddingsAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}

const PropertyEmbeddings = sequelize.define<PropertyEmbeddingsInstance>("Property_Embeddings", {
    id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
    },
    property_id: { type: DataTypes.UUID, allowNull: true },
    embeddings: {
        type: DataTypes.ARRAY(DataTypes.DOUBLE),
        allowNull: true,
    }

});



export default PropertyEmbeddings;
