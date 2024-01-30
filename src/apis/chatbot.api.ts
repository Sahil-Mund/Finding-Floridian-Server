import { Router } from "express";
import { getBotResponse } from "../controllers/chatbot.controller";

export const chatBotRouter = Router();

chatBotRouter.post("/v1/get-bot-response", getBotResponse);

