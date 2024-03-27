import { Router } from "express";
import { recommendPropertyHandler, insertEmbeddingHandler, homeTourHandler } from "../controllers/property.controller";
import { authorizeUser } from "../middlewares/jwt.middleware";

export const propertyRouter = Router();

// propertyRouter.post("/v1/add-property", [authorizeUser], createPropertyHandler);
propertyRouter.post("/v1/recommend-property", recommendPropertyHandler);
propertyRouter.post("/v1/insert-embedding", insertEmbeddingHandler);
propertyRouter.post("/v1/update-embedding", recommendPropertyHandler);
propertyRouter.post("/v1/request-hometour", [authorizeUser], homeTourHandler);

