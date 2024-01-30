import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// Import configs
import "./database/index";
// Import Routers
import { userRouter } from "./apis/auth.api";
import { deserializeUser } from "./middlewares/jwt.middleware";
import { contactRouter } from "./apis/contact.api";
import { chatBotRouter } from "./apis/chatbot.api";

const app = express();
app.use(cors());

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(deserializeUser);


// API's endpoint's
app.use("/api/user", userRouter);
app.use("/api/contact", contactRouter);
app.use("/api/bot", chatBotRouter);

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/health-check", (req, res) => {
  res.send("Hello World!");
});

export default app;
