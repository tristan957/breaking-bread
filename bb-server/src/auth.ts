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

export interface IAccessToken {
	aud: [string, string];
	azp: string;
	exp: number;
	iat: number;
	iss: string;
	scope: string;
	sub: string;
}

export function getToken(token: string): Promise<IAccessToken> {
	return new Promise((resolve, reject) => {
		jwt.verify(token, getKey, options, (err: jwt.VerifyErrors, decoded: IAccessToken) => {    // Decoded may need an Interface so context user is usable
			if (err || decoded === null) {
				reject(err);
			} else {
				resolve(decoded);
			}
		});
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

// console.log(process.argv[2]);
getToken(process.argv[2]).then((vafr) => {
	console.log(vafr.sub);
});
