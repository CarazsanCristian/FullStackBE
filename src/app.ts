import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./dataSource";
import authMiddleware from "./middleware/auth.middleware";
import cors from "cors";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/users.router";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import bodyParser from "body-parser";

dotenv.config();

const corsOptions = {
  origin: ["http://localhost:3600", "http://localhost:3000"],
  optionsSuccessStatus: 200,
};

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authentication app",
      version: "1.0.0",
      description: "Authetication App",
    },
    servers: [
      {
        url: "http://localhost:3600/",
        description: "Local server",
      },
    ],
  },
  apis: ["./**/*Handler.js", path.join("./src/swagger", "*.yaml")],
};

const swaggerSpec = swaggerJSDoc(options);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", cors(corsOptions), authRouter);
app.use("/users", cors(corsOptions), userRouter);
app.use(authMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
