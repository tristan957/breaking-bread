import { Auth0DecodedHash, WebAuth } from "auth0-js";
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

	public login = (): void => {
		this.auth0.authorize();
	}

	public handleAuthentication = (): void => {
		this.auth0.parseHash((e: any, result: any) => {
			if (result && result.accessToken && result.idToken) {
				this.setSession(result);
				history.replace("/");
			} else if (e) {
				history.replace("/");
				// tslint:disable-next-line:no-console
				console.error(e);
				alert(`Error: ${e.error}. Check the console for further details.`);
			}
		});
	}

	public setSession = (authResult: Auth0DecodedHash): void => {
		// tslint:disable-next-line:typedef
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

	public logout = (): void => {
		// Clear access token and ID token from local storage
		localStorage.removeItem("access_token");
		localStorage.removeItem("id_token");
		localStorage.removeItem("expires_at");
		localStorage.removeItem("user_id");
		// navigate to the home route
		history.replace("/");
	}
}