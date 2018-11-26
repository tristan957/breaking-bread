/* tslint:disable: strict-boolean-expressions */
import { Context } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { AdvancedConsoleLogger, Connection, createConnection, getConnection } from "typeorm";
import { getUserFromAuthSub } from "./auth";
import { entities } from "./entities";
import User from "./entities/User";
import { resolvers, typeDefs } from "./schema";

export interface IAppContext {
	connection: Connection;
	user: Promise<User | undefined>;
}

interface IContextParams {
	req: Request;
	res: Response;
}

function context(params: IContextParams): Context<IAppContext> {
	if (params.req.headers.oauthsub === undefined) {  // TODO: Replace with token then get sub from token
		throw Error;  // TODO: Need more elegant failure
	}

	const connection: Connection = getConnection();
	const authSub: string = params.req.headers.oauthsub as string;
	const user = getUserFromAuthSub(connection, authSub);
	// user = getUserWithToken(token);

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
		this.app = express();
		this.app.use(cors());
		this.server = new ApolloServer({ typeDefs, resolvers, context });
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
			.then((value: Connection) => {
				this.connection = value;
			})
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
			console.log(`http://localhost:${port}${this.server.graphqlPath}`);
		});
	}
}
