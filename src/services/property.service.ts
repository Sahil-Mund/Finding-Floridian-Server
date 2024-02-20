import { signJwt } from "../utils/jwt.util";
import { omit } from "lodash";
import Property from "../database/models/property.model";
import Rating from "../database/models/rating.model";
import Amenity from "../database/models/amenity.model";
import PropertyGallery from "../database/models/propertyGallery.model";
import { Transaction } from "sequelize";

export async function createProperty(property: any, options: { transaction?: Transaction } = {}): Promise<any> {
    try {
        const newProperty = await Property.create(property, options);
        console.log(newProperty);

        return {
            property: omit(newProperty?.toJSON(), "createdAt", "updatedAt"),
            // property: newProperty?.toJSON()
        };
    } catch (error: any) {
        console.log('ERROR', error);
        throw error?.errors[0]?.message;
    }
}

export async function createRating(rating: any, options: { transaction?: Transaction } = {}): Promise<any> {
    try {
        console.log(rating);
        
        const newRating = await Rating.create(rating, options);
        return newRating?.toJSON();

    } catch (error: any) {
        console.log('ERROR', error);
        throw error?.errors[0]?.message;
    }
}

export async function createAmenity(amenities: any, options: { transaction?: Transaction } = {}): Promise<any> {
    try {
        console.log(amenities);

        const input = {
            new_construction: amenities.newconstruction,
            newly_renovated: amenities.newlyrenovated || false,
            pool: amenities.pool || false,
            gym: amenities.gym || false,
            yard: amenities.yard || false,
            luxury: amenities.luxury || false,
            pet_friendly: amenities.petfriendly || false,
            parking: amenities.parking || false,
            concierge: amenities.concierge || false,
            waterfront: amenities.waterfront || false,
            in_unit_laundry: amenities.inunitlaundry || false,
            garage: amenities.garage || false,
            central_ac: amenities.centralAC || false,
            no_homeowners_association: amenities.noHomeOwnersAssociation || false,
        }
        const newAmenity = await Amenity.create(input, options);
        return newAmenity?.toJSON();

    } catch (error: any) {
        console.log('ERROR', error);
        throw error?.errors[0]?.message;
    }
}

export async function addMediaToPropertyGallery(prop: any, options: { transaction?: Transaction } = {}): Promise<any> {
    try {

        await PropertyGallery.create(prop, options);

    } catch (error: any) {
        console.log('ERROR', error);
        throw error?.errors[0]?.message;
    }
}