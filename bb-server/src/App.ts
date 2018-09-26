/* tslint:disable: strict-boolean-expressions */
import { ApolloServer, gql, IResolvers } from "apollo-server-express";
// tslint:disable-next-line: match-default-export-name
import cors from "cors";
import * as dotenv from "dotenv";
// tslint:disable-next-line: match-default-export-name
import express from "express";
import fs from "fs";
import { DocumentNode } from "graphql";
import { AdvancedConsoleLogger, Connection, createConnection, Logger } from "typeorm";
import Ingredient from "./entities/Ingredient";
import Meal from "./entities/Meal";
import Recipe from "./entities/Recipe";
import Review from "./entities/Review";
import Tag from "./entities/Tag";
import Topic from "./entities/Topic";
import User from "./entities/User";

export default class App {

    /**
     * Sets up TypeORM
     */
    public connection: Connection;
    public app: express.Application;
    public server: ApolloServer;

    /**
     * Sets up the application to connect to database and create server
     */
    public constructor() {
        dotenv.config();

        this.setupTypeORM();
        this.setupExpress();
    }

    /**
     * Sets up Express server
     */
    private setupExpress(): void {
        const schema: string = fs.readFileSync("./src/schema.gql").toString();
        const typeDefs: DocumentNode = gql`${schema}`;
        const resolvers: IResolvers = {
            Query: {
                me: (parent, args, context, info) => {
                    return {
                        username: `Robin Wieruch ${args.id}`,
                    };
                },
            },
        };

        this.app = express();
        this.app.use(cors);
        this.server = new ApolloServer({ typeDefs, resolvers });
        this.server.applyMiddleware({ app: this.app });
    }

    /**
     * Sets up TypeORM
     */
    private setupTypeORM(): void {
        const isDEV: boolean = process.env.NODE_ENV === "DEVELOPMENT";
        const logger: Logger = isDEV ?
            new AdvancedConsoleLogger(["warn", "error"]) :
            new AdvancedConsoleLogger(["warn", "error"]);

        createConnection({
            type: "postgres",
            host: process.env.TYPEORM_HOST || "localhost",
            port: parseInt(process.env.TYPEORM_PORT || "10260", 10),
            username: process.env.TYPEORM_USERNAME || "jesus",
            password: process.env.TYPEORM_PASSWORD || "christ",
            database: process.env.TYPEORM_DATABASE || "BreakingBread",
            logger,
            entities: [Ingredient, Meal, Recipe, Review, Tag, Topic, User],
            synchronize: isDEV,
        })
            .then(value => this.connection = value)
            .catch(reason => {
                console.log(`Unable to create database connection: ${reason}`);
                process.exit(1);
            });
    }

    /**
     * Runs the application
     */
    public run(): void {
        let port: number | string = process.env.APP_PORT || "10262";
        port = parseInt(port, 10);
        this.app.listen(port, () =>
            console.log(`Server ready at http://localhost:${port}${this.server.graphqlPath}`)
        );
    }
}
