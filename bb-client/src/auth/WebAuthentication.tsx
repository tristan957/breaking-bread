import { Auth0DecodedHash, Auth0Error, Auth0ParseHashError, Auth0UserProfile, WebAuth } from "auth0-js";
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

export interface IProfileInfo {
	email?: string;
	emailVerified?: boolean;
	lastName?: string;
	firstName?: string;
	imagePath?: string;
}

export class WebAuthentication implements Auth0Authentication {
	/**
	 * @property
	 * @private
	 * @type {WebAuth}
	 * @memberof WebAuthenticationManager
	 */
	// public auth0: WebAuth = new WebAuth({
	// 	domain: AUTH_CONFIG.domain,
	// 	clientID: AUTH_CONFIG.clientId,
	// 	redirectUri: AUTH_CONFIG.callbackUrl,
	// 	audience: AUTH_CONFIG.audience,
	// 	responseType: "token id_token",
	// 	scope: "openid",
	// });
	public webAuth: WebAuth = new WebAuth({
		domain: AUTH_CONFIG.domain,
		clientID: AUTH_CONFIG.clientId,
		redirectUri: AUTH_CONFIG.callbackUrl,
		audience: AUTH_CONFIG.audience,
		responseType: "token",
		scope: "openid profile email",
	});

	get authenticated(): boolean {
		// Check whether the current time is past the
		// access token"s expiry time
		// tslint:disable-next-line:no-non-null-assertion
		const expiresAt = JSON.parse(localStorage.getItem("expires_at")!);
		return new Date().getTime() < expiresAt;
	}

	public login = (): void => {
		// Trigger login page
		this.webAuth.authorize();
	}

	public handleAuthentication = async (): Promise<IProfileInfo> => {
		return new Promise((resolve, reject): void => {
			this.webAuth.parseHash((err: Auth0ParseHashError | null, result: Auth0DecodedHash | null): void => {
				if (err !== null) {
					reject(err);
				} else {
					if (result !== null && result.accessToken !== undefined && result.idToken !== undefined && result.expiresIn !== undefined) {
						this.setSession(result);

						resolve(this.getUserInfo(result));
					}
				}
			});
		});
	}

	public async getUserInfo(result: Auth0DecodedHash): Promise<IProfileInfo> {
		return new Promise((resolve, reject): void => {
			this.webAuth.client.userInfo(result.accessToken!, (errUserInfo: Auth0Error | null, user: Auth0UserProfile): void => {
				if (errUserInfo !== null) {
					reject(errUserInfo);
				} else {
					const userInfo: IProfileInfo = {
						email: user.email,
						emailVerified: user.email_verified,
						lastName: user.family_name,
						firstName: user.given_name,
						imagePath: user.picture,
					};

					resolve(userInfo);
				}
			});
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
