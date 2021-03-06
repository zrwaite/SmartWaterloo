import express from "express";
import cors from "cors";
import env from "dotenv";
import rateLimit from "express-rate-limit";
import {response} from "./models/response"; //Created pre-formatted uniform response
import {Request, Response } from "express"; //Typescript types
import { devCheck } from "./modules/devCheck";

const frontendLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 200,
	standardHeaders:true,
	legacyHeaders: false
});

const app = express();

//configs
env.config();

// utilities
app.use(cors());
app.use(express.json());


// routes
import getFrontend from "./routes/frontend.route";
import apiRoute from "./routes/api.route";
import authRoute from "./routes/auth.route";
import functionRoute from "./routes/function.route";

// api routing
app.use("/api", devCheck);
app.use("/auth", devCheck);
app.use("/function", devCheck);

app.use("/api", apiRoute);
app.use("/auth", authRoute);
app.use("/function", functionRoute);

app.get("/test", (req:Request, res:Response) => {
	let result = new response(200, [], {page: "test"}, true);
	res.status(result.status).json(result); //Return 200 result
});
app.use("/", frontendLimiter);
app.get("/", getFrontend);
app.use("/*", frontendLimiter);
app.get("/*", getFrontend);

export default app; //Export server for use in index.ts
