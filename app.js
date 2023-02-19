// Third party dependencies
import express from "express"
import "express-async-errors"
import * as dotenv from "dotenv"
import cors from "cors"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import xss from "xss-clean"

import { connectDB } from "./db/connectDB.js"

// Local dependencies
import authRouter from "./routes/auth.js"
import jobRouter from "./routes/jobs.js"

// Middlewares
import authMiddleware from "./middlewares/authMiddleware.js"
import errorHandlerMiddleware from "./middlewares/error-handler.js"




const app = express()
dotenv.config()
const port = process.env.PORT || 8000

app.set('trust proxy', 1);
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
}))


app.use("/api/v1/auth", authRouter)
app.use("/api/v1/job", authMiddleware, jobRouter)
app.use(errorHandlerMiddleware)
app.get("/", (req, res) => {
    res.send("Welcome to Job Api")
})

const start = async () => {
    try {

        await connectDB(process.env.MONGODB_URI)
        app.listen(port, () => {
            console.log(`App is listening on port ${port}`)
        })
    } catch (error) {
        console.log("There was an error connecting to the database", error)
    }
}

start()
