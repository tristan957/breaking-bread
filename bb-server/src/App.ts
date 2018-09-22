import { ApolloServer, gql, IResolvers } from "apollo-server-express";
import * as dotenv from "dotenv";
// tslint:disable: match-default-export-name
import express from "express";
import { DocumentNode } from "graphql";
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
    public app: express.Application;
    public server: ApolloServer;

    constructor() {
        dotenv.config({ path: path.resolve(process.cwd(), "dev.env") });
        this.setupTypeORM();
        this.setupExpress();
    }

    private setupExpress(): void {
        const typeDefs: DocumentNode = gql`
            type Query {
                hello: String
            }
        `;

        const resolvers: IResolvers = {
            Query: {
                hello: (): String => "Hello world!",
            },
        };

        this.app = express();
        this.server = new ApolloServer({ typeDefs, resolvers });
        this.server.applyMiddleware({ app: this.app });
    }

    private setupTypeORM(): void {
        const isDEV: boolean = process.env.NODE_ENV === "DEVELOPMENT";
        const logger: Logger = isDEV ?
            new AdvancedConsoleLogger(["warn", "error"]) :
            new AdvancedConsoleLogger(["warn", "error"]);

        createConnection({
            type: "postgres",
            host: process.env.TYPEORM_HOST,
            // tslint:disable: strict-boolean-expressions
            port: parseInt(process.env.TYPEORM_PORT || "10260", 10),
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

    public run(): void {
        // tslint:disable: strict-boolean-expressions
        let port: number | string = process.env.APP_PORT || "10262";
        port = parseInt(port, 10);
        this.app.listen(port, () =>
            console.log(`Server ready at http://localhost:${port}${this.server.graphqlPath}`)
        );
    }
}
