/* eslint-disable import/no-extraneous-dependencies */
import { DataTypes, Optional, Model, UUIDV4 } from "sequelize";
import sequelize from "../../configs/db.config";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UUID } from "crypto";

export interface RatingAttributes {
    id: UUID;
    walkability: number;
    closeness_To_restaurant: number;
    proximity_to_parks: number;
    quality_of_schools: number;
    distance_to_the_ocean: number;
    proximity_to_lake: number;
}

interface RatingInstance
    extends Model<RatingAttributes>,
    RatingAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}

const Rating = sequelize.define<RatingInstance>("Rating", {
    id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
    },
    walkability: { type: DataTypes.NUMBER, allowNull: true },
    closeness_To_restaurant: { type: DataTypes.NUMBER, allowNull: true },
    proximity_to_parks: { type: DataTypes.NUMBER, allowNull: true },
    quality_of_schools: { type: DataTypes.NUMBER, allowNull: true },
    distance_to_the_ocean: { type: DataTypes.NUMBER, allowNull: true },
    proximity_to_lake: { type: DataTypes.NUMBER, allowNull: true },

});



export default Rating;
