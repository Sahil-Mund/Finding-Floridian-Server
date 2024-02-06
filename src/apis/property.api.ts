import { Router } from "express";
import { createPropertyHandler } from "../controllers/property.controller";
import { authorizeUser } from "../middlewares/jwt.middleware";

export const propertyRouter = Router();

propertyRouter.post("/v1/add-property", [authorizeUser], createPropertyHandler);

