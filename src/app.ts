import express, { Request, Response } from "express";
import AppDataSource from "./Config/db"
const app = express();
import { rateLimit } from "express-rate-limit";
import dotenv from 'dotenv'
import UserRouter from "./routes/auth/user.routes";

dotenv.config({path:'./.env'})


// Rate limiter to avoid misuse of the service and avoid cost spikes
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   handler: (_, __, ___, options) => {
//     throw new ApiError(
//       options.statusCode || 500,
//       `There are too many requests. You are only allowed ${
//         options.max
//       } requests per ${options.windowMs / 60000} minutes`
//     );
//   },
// });


app.use(express.json());


app.use('/api/auth/v1',UserRouter)

// Database connection
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

// Start the Express server
app.listen(3000, () => {
  console.log("Server started on port 3000!");
});
