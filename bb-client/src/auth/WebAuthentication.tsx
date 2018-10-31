import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { Auth0DecodedHash, WebAuth } from "auth0-js";
import gql from "graphql-tag";
import history from "../history";
import { Auth0Authentication } from "./Auth0Authentication";
import { AUTH_CONFIG } from "./configuration";

/**
 * Web based Auth0 authentication
 *
 * @export
 * @class WebAuthentication
 * @implements {Auth0Authentication}
 */

const httpLink = new HttpLink({
	uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("access_token");
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : undefined,
		},
	};
});

const apolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export class WebAuthentication implements Auth0Authentication {
	/**
	 * @property
	 * @private
	 * @type {WebAuth}
	 * @memberof WebAuthenticationManager
	 */
	public auth0: WebAuth = new WebAuth({
		domain: AUTH_CONFIG.domain,
		clientID: AUTH_CONFIG.clientId,
		redirectUri: AUTH_CONFIG.callbackUrl,
		audience: AUTH_CONFIG.audience,
		responseType: "token id_token",
		scope: "openid",
	});

	get authenticated(): boolean {
		// Check whether the current time is past the
		// access token"s expiry time
		// tslint:disable-next-line:no-non-null-assertion
		const expiresAt = JSON.parse(localStorage.getItem("expires_at")!);
		return new Date().getTime() < expiresAt;
	}

	public login(): void {
		this.auth0.authorize();
	}

	public handleAuthentication(): void {
		this.auth0.parseHash((result: Auth0DecodedHash | null) => {
			if (result && result.accessToken && result.idToken) {
				this.setSession(result);
				this.setUser();
				history.replace("/home");
			}
		});
	}

	public setSession(authResult: Auth0DecodedHash): void {
		const { accessToken, expiresIn, idToken } = authResult;
		// Set the time that the access token will expire at
		// tslint:disable-next-line:no-non-null-assertion
		const expiresAt = JSON.stringify(expiresIn! * 1000 + new Date().getTime());
		// tslint:disable-next-line:no-non-null-assertion
		localStorage.setItem("access_token", accessToken!);
		// tslint:disable-next-line:no-non-null-assertion
		localStorage.setItem("id_token", idToken!);
		localStorage.setItem("expires_at", expiresAt);
		// navigate to the home route
		// history.replace("/home");
	}

	public logout(): void {
		// Clear access token and ID token from local storage
		localStorage.removeItem("access_token");
		localStorage.removeItem("id_token");
		localStorage.removeItem("expires_at");
		localStorage.removeItem("user_id");
		// navigate to the home route
		history.replace("/home");
	}

	public setUser(): void {
		apolloClient
			.query({
				query: gql`{message}`,
			}).then(res => {
				const data: any = res.data;
				localStorage.setItem("user_id", data.message);
			});
	}
}
