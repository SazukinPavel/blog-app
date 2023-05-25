import express, {Express} from 'express';
import dotenv from 'dotenv';
import * as mongoose from "mongoose";
import authRouter from './routers/authRouter';
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter)

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    NODE_DOCKER_PORT
} = process.env;

async function main() {
    await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`);

    app.listen(NODE_DOCKER_PORT, () => {
        console.log(`⚡️[server]: Server is running at port ${NODE_DOCKER_PORT}`);
    });
}

main()


