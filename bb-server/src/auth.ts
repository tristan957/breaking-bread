import { JwtHeader } from "jsonwebtoken";
import JwksRsa from "jwks-rsa";
import { Connection } from "typeorm";
import User from "./entities/User";

const client: JwksRsa.JwksClient = JwksRsa({
	jwksUri: `https://bbread.auth0.com//.well-known/jwks.json`,
});

const options = {
	audience: "https://bbread.com/graphql-test",
	issuer: `https://bbread.auth0.com/`,
	algorithms: ["RS256"],
};

// export function getUserWithToken(token: string): Promise<User | undefined> {
// 	const tokenDecoded = new Promise((resolve, reject) => {
// 			jwt.verify(token, getKey, options, (err: jwt.VerifyErrors, decoded: {}) => {    // Decoded may need an Interface so context user is usable
// 				if (err || decoded === null) {
// 					return reject(err);
// 				}
// 				resolve(decoded);
// 			});
// 		});

// 	tokenDecoded.then((decoded) => {
// 		// TODO: Get user from oAuthSub stored inside hopefully
// 	}).catch(() => {
// 		throw Error;  // TODO: Need more elegant failure
// 	});
// }

export function getUserFromAuthSub(connection: Connection, oAuthSub: string): Promise<User | undefined> {
	const neededRelations: string[] = [
		"hostedMeals", "mealsAttending", "whitelist", "blacklist",
		"reviews", "userReviewsAuthored", "recipeReviewsAuthored",
		"savedRecipes", "followedUsers", "recipesAuthored", "followedTags"];
	return connection
		.getRepository(User)
		.findOne({
			where: { oAuthSub },
			relations: neededRelations,
		});
}

function getKey(header: JwtHeader, cb: Function): void {
	if (header.kid === undefined) {
		return;
	}
	client.getSigningKey(header.kid, (err: Error, key: JwksRsa.Jwk) => {
		const signingKey = key.publicKey || key.rsaPublicKey;
		// tslint:disable-next-line:no-null-keyword
		cb(null, signingKey);
	});
}
