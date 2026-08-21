import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { router } from "./routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(",").map(v=>v.trim()), credentials: false }));
app.use(express.json({ limit: "1mb" }));
app.get("/health", (_req,res)=>res.json({success:true,data:{status:"ok",service:"projeto-social-api"}}));
app.use("/api", router);
app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, ()=>console.log(`Projeto Social API em http://localhost:${env.PORT}`));
