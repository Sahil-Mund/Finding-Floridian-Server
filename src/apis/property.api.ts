import { Router } from "express";
import { createPropertyHandler } from "../controllers/property.controller";

export const propertyRouter = Router();

propertyRouter.post("/v1/add-property", createPropertyHandler);

