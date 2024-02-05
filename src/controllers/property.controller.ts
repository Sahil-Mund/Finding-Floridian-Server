import { Request, Response } from "express";

import {
    successResponse,
    serverError,
    badRequest,
} from "../utils/response.util";
import { createAmenity, createProperty, createRating } from "../services/property.service";
import sequelize from "../configs/db.config";


export const createPropertyHandler = async (
    req: Request<any, any>,
    res: Response<any>
) => {
    const transaction = await sequelize.transaction();
    try {


        //Get all the data and destructure it
        const { title, subtitle, city, state, flatNo: flat_no, zip: zip_code, price, mls, description,
            property_type, num_of_bedroom: num_of_bedrooms,
            num_of_bathroom: num_of_bathrooms, located_at,
            amenities, rating, gallery, homeTour, banner_img: banner_img_url,
            serviceType: service_type } = req.body;

        const propertyParam = {
            title, subtitle, city, state, flat_no, zip_code, price, mls, description,
            property_type, num_of_bedrooms,
            num_of_bathrooms, located_at, has_opt_for_boosting: true,
            banner_img_url,
            service_type
        }

        //0. Take logged in user id
        const user = res.locals?.user || "c50fe105-3334-42d1-b26a-9d7d61db2307";
        
        //1. Create Rating [take the rating ID]
        const ratingResponse = await createRating(rating, { transaction });

        //2. Create Amenities [take the amenities ID]
        const amenitiesResponse = await createAmenity(amenities, { transaction });

        //3. Add images and videos to property gallery [take gallery ID]
        

        //4. Create Embeddings 

        //5. Add to property main table
        const propertyResponse = await createProperty({ ...propertyParam, rating_id: ratingResponse.id, amenities: amenitiesResponse.id, created_by: user }, { transaction });
        
        await transaction.commit();
        return successResponse("Property Added Successfully !!", {}, res);
    } catch (error: any) {
        console.log(error);
        await transaction.rollback();
        return serverError(error, res);
    }
};


