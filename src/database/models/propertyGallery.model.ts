/* eslint-disable import/no-extraneous-dependencies */
import { DataTypes, Optional, Model, UUIDV4 } from "sequelize";
import sequelize from "../../configs/db.config";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UUID } from "crypto";
import Property from "./property.model";

export interface PropertyGalleryAttributes {
    id: UUID;
    url: string;
    property_id: UUID;
    media_type: string;
}

interface PropertyGalleryInstance
    extends Model<PropertyGalleryAttributes>,
    PropertyGalleryAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}

const PropertyGallery = sequelize.define<PropertyGalleryInstance>("Property_Gallery", {
    id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
    },
    url: { type: DataTypes.BOOLEAN, allowNull: true },
    property_id: { type: DataTypes.UUID, allowNull: true , references:{
        model: Property,
        key: "id",
    }},
    media_type: { type: DataTypes.STRING, allowNull: true },

});

//one to many - one user can have multiple records in property gallery 
Property.hasMany(PropertyGallery, { foreignKey: "property_id" });
PropertyGallery.belongsTo(Property, { foreignKey: "property_id" });


export default PropertyGallery;
