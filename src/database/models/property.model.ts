/* eslint-disable import/no-extraneous-dependencies */
import { DataTypes, Optional, Model, UUIDV4 } from "sequelize";
import sequelize from "../../configs/db.config";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UUID } from "crypto";
import User from "./user.model";
import Rating from "./rating.model";
import Amenity from "./amenity.model";

export interface PropertyAttributes {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    created_by: string;
    mls: string;
    short_description: string;
    extended_description: string;
    area: string;
    banner_img_url: string;
    service_type: string; //rent/sale
    property_type: string; //enum
    num_of_bedrooms: number;
    num_of_bathrooms: number;
    rating_id: UUID; // connected to rating table
    amenities: UUID;
    located_in_florida: string; //enum
    property_located_at: string;//enum
    has_opt_for_boosting: boolean;
    city: string;
    state: string;
    zip_code: string;
    flat_no: string;
}

interface PropertyInstance
    extends Model<PropertyAttributes>,
    PropertyAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}

const Property = sequelize.define<PropertyInstance>("Property", {
    id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
    },
    title: { type: DataTypes.STRING, allowNull: true },
    subtitle: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.NUMBER, allowNull: true },
    created_by: {
        type: DataTypes.UUID, references: {
            model: User,
            key: "id", // This should match the primary key of the User model
        },
    },
    mls: { type: DataTypes.STRING, allowNull: true },
    short_description: { type: DataTypes.STRING, allowNull: true },
    extended_description: { type: DataTypes.STRING, allowNull: true },
    area: { type: DataTypes.STRING, allowNull: true },
    banner_img_url: { type: DataTypes.STRING, allowNull: true },
    service_type: { type: DataTypes.STRING, allowNull: true }, //rent/sale
    property_type: { type: DataTypes.STRING, allowNull: true }, //enum
    num_of_bedrooms: { type: DataTypes.NUMBER, allowNull: true },
    num_of_bathrooms: { type: DataTypes.NUMBER, allowNull: true },
    rating_id: {
        type: DataTypes.UUID, allowNull: true, references: {
            model: Rating,
            key: "id", // This should match the primary key of the User model
        },
    }, // connected to rating table
    amenities: {
        type: DataTypes.UUID, allowNull: true, references: {
            model: Amenity,
            key: "id", // This should match the primary key of the User model
        },
    },
    located_in_florida: { type: DataTypes.STRING, allowNull: true },//enum
    property_located_at: { type: DataTypes.STRING, allowNull: true },//enum
    has_opt_for_boosting: { type: DataTypes.BOOLEAN, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    zip_code: { type: DataTypes.STRING, allowNull: true },
    flat_no: { type: DataTypes.STRING, allowNull: true },
});

//one to many - one user can create many project
User.hasMany(Property, { foreignKey: "created_by" });
Property.belongsTo(User, { foreignKey: "created_by" });

// //one to one - one property can have a single rating 
// Property.hasOne(Rating, { foreignKey: "rating_id" });
// Rating.belongsTo(Property, { foreignKey: "rating_id" });

// //one to one - one property can have a single amenity record 
// Property.hasOne(Amenity, { foreignKey: "amenities" });
// Amenity.belongsTo(Property, { foreignKey: "amenities" });


export default Property;
