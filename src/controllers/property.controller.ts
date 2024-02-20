import { Request, Response } from "express";

import {
    successResponse,
    serverError,
    badRequest,
} from "../utils/response.util";
import { addMediaToPropertyGallery, createAmenity, createProperty, createRating } from "../services/property.service";
import sequelize from "../configs/db.config";


export const createPropertyHandler = async (
    req: Request<any, any>,
    res: Response<any>
) => {
    const transaction = await sequelize.transaction();
    try {


        console.log('req.body', req.body);

        //Get all the data and destructure it
        const { title, subtitle, city, state, flatNo: flat_no, zip: zip_code, price, mls,
            property_type, num_of_bedroom: num_of_bedrooms,
            num_of_bathroom: num_of_bathrooms, located_in_florida, property_located_at,
            amenities, rating, banner_img: banner_img_url,
            serviceType: service_type, gallery_images_urls, home_tour_video, short_description, extended_description, area,
        } = req.body;

        const propertyParam = {
            title, subtitle, city, state, flat_no, zip_code, price, mls, short_description,  extended_description, area,
            property_type, num_of_bedrooms,
            num_of_bathrooms, property_located_at, located_in_florida, has_opt_for_boosting: true,
            banner_img_url, home_tour_video,
            service_type
        }

        //0. Take logged in user id
        const user = res.locals?.user?.id;

        //1. Create Rating [take the rating ID]
        const ratingResponse = await createRating(rating, { transaction });

        //2. Create Amenities [take the amenities ID]
        const amenitiesResponse = await createAmenity(amenities, { transaction });

        //3. Create Embeddings 

        //4. Add to property main table
        const propertyResponse = await createProperty({ ...propertyParam, rating_id: ratingResponse.id, amenities: amenitiesResponse.id, created_by: user }, { transaction });

        //5. Add images to property gallery
        if (gallery_images_urls && gallery_images_urls.length !== 0) {

            const promises = gallery_images_urls.map(async (img: any) => {
                await addMediaToPropertyGallery({ url: img, media_type: 'gallery_images', property_id: propertyResponse.property.id }, { transaction });

            });

            // Wait for all promises to resolve before continuing
            await Promise.all(promises);
        }


        // 6. Add videos to property gallery
        if (home_tour_video) {
            await addMediaToPropertyGallery({
                url: home_tour_video, media_type: 'home_tour_video', property_id: propertyResponse.property.id
            }, { transaction })
        }

        await transaction.commit();
        return successResponse("Property Added Successfully !!", {}, res);
    } catch (error: any) {
        console.log(error);
        await transaction.rollback();
        return serverError(error, res);
    }
};


