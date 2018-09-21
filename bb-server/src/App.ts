import * as dotenv from "dotenv";
import path from "path";
import { AdvancedConsoleLogger, Connection, createConnection, Logger } from "typeorm";
import Ingredient from "./entities/Ingredient";
import Meal from "./entities/Meal";
import Recipe from "./entities/Recipe";
import Review from "./entities/Review";
import Topic from "./entities/Topic";
import User from "./entities/User";

export default class App {
    public connection: Connection;

    constructor() {
        dotenv.config({ path: path.resolve(process.cwd(), "dev.env") });
        this.setupTypeORM();
        this.setupExpress();
    }

    private setupExpress(): void {
        return;
    }

    private setupTypeORM(): void {
        const isDEV: boolean = process.env.NODE_ENV === "DEVELOPMENT";
        const logger: Logger = isDEV ?
            new AdvancedConsoleLogger("all") :
            new AdvancedConsoleLogger(["warn", "error"]);

        createConnection({
            type: "postgres",
            host: process.env.TYPEORM_HOST,
            port: parseInt(process.env.TYPEORM_PORT, 10),
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
            logger,
            entities: [Ingredient, Meal, Recipe, Review, Topic, User],
            synchronize: isDEV,
        })
            .then(value => this.connection = value)
            .catch(reason => {
                console.log(`Unable to create database connection: ${reason}`);
                process.exit(1);
            });
    }
}
