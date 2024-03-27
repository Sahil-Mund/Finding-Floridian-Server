import { Request, Response } from "express";

import {
    successResponse,
    serverError,
    badRequest,
} from "../utils/response.util";
import { convertQuestionnaireToQuery, createAmenity, createProperty, createRating, findSimilarDocuments, formatQuestionnaireData, generateEmbedding, getRecommendedProperties } from "../services/property.service";
import sequelize from "../configs/db.config";
import supabaseClient from "../configs/supabase";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { sendHomeTourRequestNotification } from "../services/mail.service";
import { server } from "typescript";


// export const createPropertyHandler = async (
//     req: Request<any, any>,
//     res: Response<any>
// ) => {
//     const transaction = await sequelize.transaction();
//     try {


//         console.log('req.body', req.body);

//         //Get all the data and destructure it
//         const { title, subtitle, city, state, flatNo: flat_no, zip: zip_code, price, mls,
//             property_type, num_of_bedroom: num_of_bedrooms,
//             num_of_bathroom: num_of_bathrooms, located_in_florida, property_located_at,
//             amenities, rating, banner_img: banner_img_url,
//             serviceType: service_type, gallery_images_urls, home_tour_video, short_description, extended_description, area,
//         } = req.body;

//         const propertyParam = {
//             title, subtitle, city, state, flat_no, zip_code, price, mls, short_description, extended_description, area,
//             property_type, num_of_bedrooms,
//             num_of_bathrooms, property_located_at, located_in_florida, has_opt_for_boosting: true,
//             banner_img_url, home_tour_video,
//             service_type
//         }

//         //0. Take logged in user id
//         const user = res.locals?.user?.id;

//         // ----------------OLD PROCESS-------------------

//         // //1. Create Rating [take the rating ID]
//         // const ratingResponse = await createRating(rating, { transaction });

//         // //2. Create Amenities [take the amenities ID]
//         // const amenitiesResponse = await createAmenity(amenities, { transaction });

//         // //3. Create Embeddings 

//         // //4. Add to property main table
//         // const propertyResponse = await createProperty({ ...propertyParam, rating_id: ratingResponse.id, amenities: amenitiesResponse.id, created_by: user }, { transaction });

//         // --------------------END HERE---------------------------


//         //1. Add to property main table
//         const propertyResponse = await createProperty({ ...propertyParam, created_by: user }, { transaction });


//         //2. Create Rating [take the rating ID]
//         const ratingResponse = await createRating({ ...rating, property_id: propertyResponse.property.id }, { transaction });

//         //3. Create Amenities [take the amenities ID]
//         const amenitiesResponse = await createAmenity({ ...amenities, property_id: propertyResponse.property.id }, { transaction });

//         //3. Create Embeddings 


//         //5. Add images to property gallery
//         if (gallery_images_urls && gallery_images_urls.length !== 0) {

//             const promises = gallery_images_urls.map(async (img: any) => {
//                 await addMediaToPropertyGallery({ url: img, media_type: 'gallery_images', property_id: propertyResponse.property.id }, { transaction });

//             });

//             // Wait for all promises to resolve before continuing
//             await Promise.all(promises);
//         }


//         // 6. Add videos to property gallery
//         if (home_tour_video) {
//             await addMediaToPropertyGallery({
//                 url: home_tour_video, media_type: 'home_tour_video', property_id: propertyResponse.property.id
//             }, { transaction })
//         }

//         await transaction.commit();
//         return successResponse("Property Added Successfully !!", {}, res);
//     } catch (error: any) {
//         console.log(error);
//         await transaction.rollback();
//         return serverError(error, res);
//     }
// };


export const recommendPropertyHandler = async (req: Request<any, any>,
    res: Response<any>) => {

    try {
        const { questionnaire } = req.body;


        if (!questionnaire) {
            return serverError("Please try again, questionnaire is not in correct format ", res);
        }


        // 1. Format the questionnaire data
        const formattedData = formatQuestionnaireData(questionnaire);

        //2.  Get query from the formattedData
        const query = convertQuestionnaireToQuery(formattedData, questionnaire);

        //3. Function to generate embedding for a asked query
        const queryEmbedding = await generateEmbedding(query);

        // console.log(formattedData, query, queryEmbedding)
        // return;
        // 4. Function to find similar documents in Supabase using cosine similarity
        const similarDocuments = await findSimilarDocuments(queryEmbedding, formattedData);

        if (similarDocuments?.length === 0) {
            console.log("No similar documents found.");
            return successResponse("Property Recommended Successfully !!", { recommendedProperties: [] }, res);
        }

        console.log(similarDocuments);

        //5. get recommended property details
        const recommendedProperties = await getRecommendedProperties(similarDocuments, query);

        console.log(recommendedProperties);


        return successResponse("Property Recommended Successfully !!", { recommendedProperties }, res);

    } catch (error) {
        console.log(error);
        return serverError(error, res);
    }

}

export const insertEmbeddingHandler = async (req: Request, res: Response) => {
    try {


        const { property_id } = req.body;
        const { data: PropertyData, error: PropertyError } = await supabaseClient
            .from("Properties")
            .select(
                `*,
                Ratings(
                    *
                ),
                Amenities(
                    *
                )
              
                `
            )
            .eq('id', property_id).single();

        if (PropertyError) {
            console.log("**ERROR**", PropertyError);
            return PropertyError;
        }

        const { data: locationData, error: locationError } = await supabaseClient
            .from("property_location_master")
            .select()
            .eq('location_id', PropertyData.location_id)
            .single();

        if (locationError) {
            console.log("**location Error**", locationError);
            return locationError;
        }
        const { data: subLocationData, error: subLocationError } = await supabaseClient
            .from("property_florida_sub_location_master")
            .select()
            .eq('sub_location_id', PropertyData.florida_sub_location_id)
            .single();

        if (subLocationError) {
            console.log("**Sub Location Error**", subLocationError);
            return subLocationError;
        }
        const { data: propertyTypeData, error: propertyTypeError } = await supabaseClient
            .from("property_type_master")
            .select()
            .eq('property_type_id', PropertyData.property_type_id)
            .single();

        if (propertyTypeError) {
            console.log("**Property Type Error**", propertyTypeError);
            return propertyTypeError;
        }

        const { data: serviceTypeData, error: serviceTypeError } = await supabaseClient
            .from("service_type_master")
            .select()
            .eq('service_type_id', PropertyData.service_type_id)
            .single();

        if (serviceTypeError) {
            console.log("**Service Type Error**", serviceTypeError);
            return serviceTypeError;
        }

        const trueAmenities = Object.keys(PropertyData.Amenities).filter(key => PropertyData.Amenities[key] === true);

        // // Converting the array of keys into a comma-separated string
        const trueAmenitiesText = trueAmenities.join(', ');
        // console.log('***DATA***', {
        //     PropertyData, trueAmenitiesText, subLocationData, locationData, propertyTypeData, serviceTypeData
        // });
        // return


        const formattedText = `Title: ${PropertyData.title}, Property Type: ${propertyTypeData.property_type
            }, Listing Type: ${serviceTypeData.type
            }, is an exquisite property located in Location: ${locationData.location
            }, within the Florida Sub-Location: ${subLocationData.sub_location
            }. It is equipped with Amenities such as: ${trueAmenitiesText
            }. The price of the property is  $${PropertyData.price}.
Property_id : ${PropertyData.id}
Ratings: 
- Transit : ${PropertyData.Ratings.Transit}
- Shop : ${PropertyData.Ratings.Shop} 
- Health : ${PropertyData.Ratings.Health} 
- Food : ${PropertyData.Ratings.Food} 
- Entertainment : ${PropertyData.Ratings.Entertainment} 
- Coffee : ${PropertyData.Ratings.Coffee} 
- Grocery : ${PropertyData.Ratings.Grocery} 
- Fitness : ${PropertyData.Ratings.Fitness} 
- Childcare : ${PropertyData.Ratings.Childcare} 
- Park : ${PropertyData.Ratings.Park} 
- High : ${PropertyData.Ratings.High} 
- Elem : ${PropertyData.Ratings.Elem} .`;



        // console.log(formattedText);

        // return;
        const queryEmbedding = await generateEmbedding(formattedText);

        const { data, error } = await supabaseClient.from("properties_embeddings").insert({
            embedding: queryEmbedding,
            property_id: property_id,
            content: formattedText,
        });

        if (error) {
            console.log("ERROR OCCUR", error);
            serverError(error, res);
            return;
        }

        return successResponse("Embedding Created Successfully !!", {}, res);


    } catch (error) {
        console.log(error);

        return serverError(error, res)
    }
}


export const homeTourHandler = async (
    req: Request<any, any>,
    res: Response<any>
) => {
    try {
        const { formData } =
            req.body;

        if (
            !formData
        ) {
            return badRequest(
                "Invalid Requests",
                {},
                res
            );
        }

        const user = res.locals?.user;



        const { data: userData, error: userError } = await supabaseClient.from('Users').select().eq('id', user.id).single();
        if (userError) {
            console.log('***userError', userError);
            return serverError("Something went wrong", res);
        }
        const { data: propertyData, error: propertyError } = await supabaseClient.from('Properties').select().eq('id', formData.id).single();

        if (propertyError) {
            console.log('***propertyError', propertyError);

            return serverError("Something went wrong", res);
        }
        const { data: serviceTypeData, error: serviceTypeError } = await supabaseClient.from('service_type_master').select().eq('service_type_id', propertyData.service_type_id).single();

        if (serviceTypeError) {
            console.log('***serviceTypeError', serviceTypeError);
            return serverError("Something went wrong", res);
        }
        console.log(userData, propertyData, serviceTypeData);


        const { data: updateData, error: updateError } = await supabaseClient
            .from('Properties')
            .update({ has_requested_for_hometour: true })
            .eq('id', formData.id)
            .select()

        if (updateError) {
            console.log('***updateError', updateError);
            return serverError("Something went wrong", res);
        }


        const mailData = {
            property_title: propertyData.title,
            userEmail: userData.email,
            userName: userData.name,
            userPhone: userData.phone_number,
            property_short_description: propertyData.short_description,
            property_type: serviceTypeData.type,
            property_price: propertyData.price
        }

        // Send mail to the user
        await sendHomeTourRequestNotification(
            mailData
        );

        return successResponse("Request Sent Successfully !!", {}, res);
    } catch (error: any) {
        return serverError(error, res);
    }
};