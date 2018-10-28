/* tslint:disable: strict-boolean-expressions */
import { Context } from "apollo-server-core";
import { makeExecutableSchema } from "apollo-server-express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
// tslint:disable-next-line: match-default-export-name
import express, { Request, Response } from "express";
import graphqlHTTP from "express-graphql";
import jwt, { RequestHandler } from "express-jwt";
import { GraphQLSchema } from "graphql";
import JwksRsa from "jwks-rsa";
import path from "path";
import { AdvancedConsoleLogger, Connection, createConnection, getConnection, Logger } from "typeorm";
import { entities } from "./entities";
import { resolvers, typeDefs } from "./schema";

export interface IAppContext {
    connection: Connection;
    // tslint:disable-next-line:no-any
    user: any;
}

const jwtCheck: RequestHandler = jwt({
    secret: JwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://bbread.auth0.com/.well-known/jwks.json",
    }),
    audience: "https://bbread.com/graphql-test",
    issuer: "https://bbread.auth0.com/",
    algorithms: ["RS256"],
});

function context(req: Request): Context<IAppContext> {
    const connection: Connection = getConnection();

    return {
        connection,
        user: req.user,
    };
}

export default class App {

    public connection: Connection;
    public app: express.Application;
    // public server: ApolloServer;

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

        // React client
        const clientPath: string = path.join(__dirname, "/./../../bb-client/dist/");
        this.app.use(express.static(clientPath));
        this.app.get("/", (_: Request, res: Response) => {
            res.sendFile(path.join(clientPath, "index.html"));
        });

        const schema: GraphQLSchema = makeExecutableSchema({
            typeDefs,
            resolvers,
        });

        this.app.use(
            "/graphql",
            bodyParser.json(),
            jwtCheck,
            graphqlHTTP((req) => ({
                schema,
                context,
            }))
        );
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
            console.log(`GraphQL test at http://localhost:${port}`);
        });
    }
}
