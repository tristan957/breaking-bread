/* tslint:disable: strict-boolean-expressions */
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import { default as express } from "express";
import { AdvancedConsoleLogger, Connection, createConnection } from "typeorm";
import { entities } from "./entities";
import { resolvers, typeDefs } from "./schema";

export default class App {

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
        this.app = express();

        this.server = new ApolloServer({ typeDefs, resolvers });
        this.server.applyMiddleware({ app: this.app });
    }

    /**
     * Sets up TypeORM
     */
    private setupTypeORM(): void {
        const isDEV = process.env.NODE_ENV === "DEVELOPMENT";
        const logger = isDEV ?
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
            entities,
            synchronize: true,
        })
            .then((value: Connection) => this.connection = value)
            .catch((reason: void) => {
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
        this.app.listen(port, () => {
            console.log(`Server ready at http://localhost:${port}`);
            console.log(`GraphQL test at http://localhost:${port}${this.server.graphqlPath}`);
        });
    }
}
