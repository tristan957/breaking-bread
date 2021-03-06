/**
 * Contract for Auth0 configuration file
 * @export
 * @interface Auth0Config
 */
// tslint:disable-next-line:interface-name
export interface Auth0Config {
	/**
	 * @property
	 * @type {string}
	 * @memberof Auth0Config
	 */
	audience: string;
	/**
	 * @property
	 * @type {string}
	 * @memberof Auth0Config
	 */
	domain: string;
	/**
	 * @property
	 * @type {string}
	 * @memberof Auth0Config
	 */
	clientId: string;
	/**
	 * @property
	 * @type {string}
	 * @memberof Auth0Config
	 */
	callbackUrl: string;
}
