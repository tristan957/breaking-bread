import jwt, { JwtHeader } from "jsonwebtoken";
import JwksRsa from "jwks-rsa";

const client: JwksRsa.JwksClient = JwksRsa({
	jwksUri: `https://bbread.auth0.com/.well-known/jwks.json`,
});

const options = {
	audience: "https://www.bbread.org/api/v1/graphql",
	issuer: `https://bbread.auth0.com/`,
	algorithms: ["RS256"],
};

export function getToken(token: string): void {

	// const tokenDecoded = new Promise((resolve, reject) => {
	jwt.verify(token, getKey, options, (err: jwt.VerifyErrors, decoded: {}) => {    // Decoded may need an Interface so context user is usable
		if (err || decoded === null) {
			console.log(err);
		} else {
			console.log(decoded);
		}
	});
	// });

	// tokenDecoded.then((decoded) => {
	// 	console.log(decoded);
	// 	// TODO: Get user from oAuthSub stored inside hopefully
	// }).catch(() => {
	// 	throw Error;  // TODO: Need more elegant failure
	// });
}

// export function getUserFromAuthSub(connection: Connection, oAuthSub: string): Promise<User | undefined> {
// 	const relations: string[] = [
// 		"hostedMeals", "mealsAttending", "reviews", "userReviewsAuthored", "recipeReviewsAuthored",
// 		"savedRecipes", "followedUsers", "followedBy", "recipesAuthored", "followedTags",
// 	];
// 	return connection
// 		.getRepository(User)
// 		.findOne({
// 			where: { oAuthSub },
// 			relations,
// 		});
// }

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

// console.log(process.argv[2]);
getToken(process.argv[2]);
