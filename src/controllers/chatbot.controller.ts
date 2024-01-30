import { Request, Response } from "express";

import {
  successResponse,
  serverError,
  badRequest,
} from "../utils/response.util";
import {
  findSimilarDocuments,
  generateEmbedding,
  generateOpenAIResponse,
} from "../services/bot.service";
import { getResponseByBot } from "../services/chatbot.service";

type botQuerySchema = {
  query: string;
};

export const getBotResponse = async (
  req: Request<any, any, botQuerySchema>,
  res: Response
) => {
  try {
    const { query } = req.body;
    if (!query) {
      return badRequest("Invalid request", {}, res);
    }

    // const queryEmbedding = await generateEmbedding(query);
    // const similarDocuments = await findSimilarDocuments(queryEmbedding);
    // const response = await generateOpenAIResponse(similarDocuments, query);

    const response = await getResponseByBot(query);
    console.log(response);
    

    return successResponse("Response generated successfully !!", response.text, res);
  } catch (error: any) {
    console.log(error);

    return serverError(error, res);
  }
};
