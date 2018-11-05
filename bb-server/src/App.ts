/* tslint:disable: strict-boolean-expressions */
import { ApolloServer } from "apollo-server";
import { Context } from "apollo-server-core";
import dotenv from "dotenv";
// tslint:disable-next-line: match-default-export-name
import { Request } from "express";
import jwt, { JwtHeader } from "jsonwebtoken";
import { Jwk, JwksClient } from "jwks-rsa";
import { AdvancedConsoleLogger, Connection, createConnection, getConnection } from "typeorm";
import { entities } from "./entities";
import { resolvers, typeDefs } from "./schema";

export interface IAppContext {
	connection: Connection;
	// tslint:disable-next-line:no-any
	user: any;
}

const client: JwksClient = new JwksClient({
	jwksUri: `https://bbread.auth0.com//.well-known/jwks.json`,
});

function getKey(header: JwtHeader, cb: Function): void {
	if (header.kid === undefined) {
		return;
	}
	client.getSigningKey(header.kid, (err: Error, key: Jwk) => {
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
		user: req.user,
	};
}

export default class App {
	public connection: Connection;
	public server: ApolloServer;

	/**
	 * Sets up the application to connect to database and create server
	 */
	public constructor() {
		dotenv.config();

		this.setupTypeORM();
		this.server = new ApolloServer({ typeDefs, resolvers, context });
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
		this.server.listen(port, () => {
			console.log(`Server ready at http://localhost:${port}`);
			console.log(`GraphQL test at http://localhost:${port}${this.server.graphqlPath}`);
		});
	}
}
