import { Router } from "express";
import { sendMailHandler } from "../controllers/contact.controller";

export const contactRouter = Router();

contactRouter.post("/v1/contact-us", sendMailHandler);

