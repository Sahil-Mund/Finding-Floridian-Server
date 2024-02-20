/* eslint-disable import/no-extraneous-dependencies */
import { DataTypes, Optional, Model, UUIDV4 } from "sequelize";
import sequelize from "../../configs/db.config";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UUID } from "crypto";

export interface AmenityAttributes {
    id: UUID;
    new_construction: boolean;
    newly_renovated: boolean;
    pool: boolean;
    gym: boolean;
    yard: boolean;
    luxury: boolean;
    pet_friendly: boolean;
    parking: boolean;
    concierge: boolean;
    waterfront: boolean;
    in_unit_laundry: boolean;
    garage: boolean;
    no_homeowners_association: boolean;
    central_ac: boolean;
}

interface AmenityInstance
    extends Model<AmenityAttributes>,
    AmenityAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}

const Amenity = sequelize.define<AmenityInstance>("Amenity", {
    id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
    },
    new_construction: { type: DataTypes.BOOLEAN, allowNull: true },
    newly_renovated: { type: DataTypes.BOOLEAN, allowNull: true },
    pool: { type: DataTypes.BOOLEAN, allowNull: true },
    gym: { type: DataTypes.BOOLEAN, allowNull: true },
    yard: { type: DataTypes.BOOLEAN, allowNull: true },
    luxury: { type: DataTypes.BOOLEAN, allowNull: true },
    pet_friendly: { type: DataTypes.BOOLEAN, allowNull: true },
    parking: { type: DataTypes.BOOLEAN, allowNull: true },
    concierge: { type: DataTypes.BOOLEAN, allowNull: true },
    waterfront: { type: DataTypes.BOOLEAN, allowNull: true },
    in_unit_laundry: { type: DataTypes.BOOLEAN, allowNull: true },
    garage: { type: DataTypes.BOOLEAN, allowNull: true },
    central_ac: { type: DataTypes.BOOLEAN, allowNull: true },
    no_homeowners_association: { type: DataTypes.BOOLEAN, allowNull: true },

});



export default Amenity;
