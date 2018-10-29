/* tslint:disable: strict-boolean-expressions */
import { Context } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
// tslint:disable-next-line: match-default-export-name
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import path from "path";
import { AdvancedConsoleLogger, Connection, createConnection, getConnection, Logger } from "typeorm";
import { entities } from "./entities";
import { resolvers, typeDefs } from "./schema";

export interface IAppContext {
    connection: Connection;
    user: Promise<{}> | undefined;
}

const client = jwksClient({
    jwksUri: `https://bbread.auth0.com//.well-known/jwks.json`,
});

// tslint:disable-next-line:no-any
function getKey(header: any, cb: Function): void {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        // tslint:disable-next-line:no-null-keyword
        cb(null, signingKey);
    });
}

const options = {
    audience: "https://bbread.com/graphql-test",
    issuer: `https://bbread.auth0.com/`,
    algorithms: ["RS256"],
};

function context(req: Request): Context<IAppContext> {
    const connection = getConnection();
    const token: string | undefined = req.headers.authorization;
    let user: Promise<{}> | undefined = undefined;
    if (token !== undefined) {
        user = new Promise((resolve, reject) => {
            /**
             * Seems TSlint cannot see function overrides
             * Works here: https://auth0.com/blog/develop-modern-apps-with-react-graphql-apollo-and-add-authentication/
             * If this isn't possible the key can be loaded directly from a file
             * Key found here: https://auth0.com/docs/api-auth/tutorials/verify-access-token#how-can-i-verify-the-signature-
             */
            jwt.verify(token, getKey, options, (err: jwt.VerifyErrors, decoded: null | {} | string) => {    // Decoded may need an Interface so context user is usable
                if (err || decoded === null) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }

    return {
        connection,
        user,
    };
}

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

        // React client
        const clientPath: string = path.join(__dirname, "/./../../bb-client/dist/");
        this.app.use(express.static(clientPath));
        this.app.get("/", (_: Request, res: Response) => {
            res.sendFile(path.join(clientPath, "index.html"));
        });

        this.server = new ApolloServer({
            typeDefs,
            resolvers,
            context,
        });
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
