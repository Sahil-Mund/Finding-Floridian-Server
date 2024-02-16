import { Router } from "express";
import { sendAdminMailHandler, sendMailHandler } from "../controllers/contact.controller";

export const contactRouter = Router();

contactRouter.post("/v1/contact-us", sendMailHandler);
contactRouter.post("/v1/contact-user-data", sendAdminMailHandler);

