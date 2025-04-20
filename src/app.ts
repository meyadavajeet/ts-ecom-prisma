import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import { PORT } from "./configs/secrets";
import startupRoutes from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error.middleware";
import { SignupSchema } from "./validator-schema/user";

const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/", startupRoutes);

// prisma client
export const prismaClient = new PrismaClient({
  log: ["query"],
});

// Handle errors
// This should be the last middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
