import { signJwt } from "../utils/jwt.util";
import { omit } from "lodash";
import Property from "../database/models/property.model";
import Rating from "../database/models/rating.model";
import Amenity from "../database/models/amenity.model";
import PropertyGallery from "../database/models/propertyGallery.model";
import { Transaction } from "sequelize";
import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "@langchain/core/documents";
import supabaseClient from "../configs/supabase";
import { config } from "dotenv";
import axios from "axios";

config();

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
            property_id: amenities.property_id
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

export async function generateEmbedding(text: string) {
    const openAIEmbeddings = new OpenAIEmbeddings();
    const embeddings = await openAIEmbeddings.embedQuery(text);
    return embeddings;
}

export async function findSimilarDocuments(queryEmbedding: any, requestBody: any) {

    let { data, error } = await supabaseClient.rpc(
        "get_filtered_properties",
        requestBody
    );
    if (error) console.error(error);

    console.log("**********LENGTH", data.length);
    console.log("**********Data", data);
    console.log("**********requestBody", requestBody);

    const requiredIds = data.map((ele: any) => ele.property_id);
    console.log(requiredIds);



    const { data: propsData, error: propsError } = await supabaseClient.rpc(
        "match_embedding_records",
        {
            query_embedding: queryEmbedding,
            ids: requiredIds, // array of IDs
            match_count: 9,
        }
    );
    if (propsError) return console.error(propsError);

    console.log(propsData.length);
    return propsData;
}

export async function getRecommendedProperties(similarDocuments: any, query: string) {
    const concatenatedPageContent = similarDocuments
        .map((data: any) => data.content)
        .join(" ");

    const llm = new OpenAI({});
    const chain = loadQAStuffChain(llm);

    try {
        const inputDocument = [
            new Document({ pageContent: concatenatedPageContent }),
        ];


        console.log(inputDocument, query);


        const result = await chain.call({
            input_documents: inputDocument,
            question: query,
        });

        console.log(result);


        const propertyIds = similarDocuments.sort((a: any, b: any) => b.similarity - a.similarity).slice(0, 3).map((ele: any) => ele.property_id);
        console.log(propertyIds);


        const { data: properties, error: PropertyError } = await supabaseClient
            .from("Properties")
            .select()
            .in('id', propertyIds)


        console.log(properties);


        return properties;
    } catch (error) {
        console.error("Error:", error);
        return error;
    }
}

const capitalizeFistChar = (word: any) => word.charAt(0).toUpperCase() + word.slice(1);

export function formatQuestionnaireData(questionnaire: any) {


    let minBudget, maxBudget;
    if (questionnaire["1"].options !== "$5,000+") {
        const prices = questionnaire["1"].options
            .replace("$", "")
            .replace(",", "")
            .split("-$")
            .map((ele: any) => ele.replace(",", ""));

        minBudget = prices[0];
        maxBudget = prices[1];
    } else {
        const prices = questionnaire["1"].options
            .replace("$", "")
            .replace(",", "")
            .split("-$")
            .map((ele: any) => ele.replace(",", ""));

        minBudget = prices[0].replace('+', '');
        maxBudget = 9999999999;
    }




    const location = questionnaire["3"].options;

    let subLocation = questionnaire["6"].options;
    let ratings = questionnaire["4"].options;
    //number of bathrooms and bedroom should be less than equal
    const num_bathrooms = questionnaire["accessories"].num_of_bathroom.split('+')[0];
    const num_bedrooms = questionnaire["accessories"].num_of_bedroom.split('+')[0];

    const requestBody = {
        // ratings
        childcare_rating: 2 * ratings.Childcare,
        coffee_rating: 2 * ratings.Coffee,
        elem_rating: 2 * ratings.Elem,
        entertainment_rating: 2 * ratings.Entertainment,
        fitness_rating: 2 * ratings.Fitness,
        food_rating: 2 * ratings.Food,
        grocery_rating: 2 * ratings.Grocery,
        health_rating: 2 * ratings.Health,
        high_rating: 2 * ratings.High,
        park_rating: 2 * ratings.Park,
        shop_rating: 2 * ratings.Shop,
        transit_rating: 2 * ratings.Transit,
        // price range
        min_price: minBudget,
        max_price: maxBudget,
        //bathroom and bedroom
        num_bathrooms: num_bathrooms,
        num_bedrooms: num_bedrooms,
        // type of service, whether its rent or sell
        service_type_value: capitalizeFistChar(questionnaire["service_type"]),
        // locations 
        location_value: location,
        florida_sub_location_value: subLocation,

    };

    return requestBody;
}

export function convertQuestionnaireToQuery(data: any, questionnaire: any) {

    const [minBudget, maxBudget] = questionnaire["1"].options
        .replace("$", "")
        .replace(",", "")
        .split("-$")
        .map((ele: any) => ele.replace(",", ""));

    const location = questionnaire["3"].options;

    let subLocation = questionnaire["6"].options;

    let ratings = questionnaire["4"].options;
    //number of bathrooms and bedroom should be less than equal
    const num_bathrooms = questionnaire["accessories"].num_of_bathroom.split('+')[0];
    const num_bedrooms = questionnaire["accessories"].num_of_bedroom.split('+')[0];


    const typeOfRentals = questionnaire["2"].options.join(", ");
    const amenities = questionnaire["5"].options.join(", ");


    // return `recommend three properties for which the location should be ${location} and florida sub location will be '${subLocation}'.
    // This property should have rental type as one of the followings ${typeOfRentals}. Also it should include amenities such as ${amenities}. Make sure not to give results randomly Give result in JSON format and only includes property id.
    // `
    return `You are a property recommender system designed to help users find properties that align with their preferences. Recommend top 3 similar properties that exactly meet the provided specifications. 
    The property should be in the range of ${minBudget} to ${maxBudget}. The location should be ${location} and florida sub location will be ${subLocation}.
    This property should have rental type as one of the followings ${typeOfRentals}. Also it should include amenities such as ${amenities}. Make sure to return only property id in JSON format.
    Make sure not to predict outside of the provided context.
    `
}