export { Entry as LocationEntry } from "node-geocoder";
import dotenv from "dotenv";
import node_geocoder from "node-geocoder";

dotenv.config({ path: `${__dirname}/../../api_keys.env` });

const options: node_geocoder.Options = {
	provider: "google",
	apiKey: process.env.GOOGLE_PLACES_KEY,
	formatter: null,
};

const geocoder: node_geocoder.Geocoder = node_geocoder(options);

export async function getLocationByAddress(address: string, countryCode: string): Promise<node_geocoder.Entry | undefined> {
	const locations: node_geocoder.Entry[] = await geocoder.geocode({ address, countryCode, minConfidence: 0.75, limit: 1 });
	if (locations.length === 0) { return undefined; }

	return locations[0];
}

export async function getLocationByCoords(lat: number, lon: number): Promise<node_geocoder.Entry | undefined> {
	const locations: node_geocoder.Entry[] = await geocoder.reverse({ lat, lon });
	if (locations.length === 0) { return undefined; }

	return locations[0];
}

export function getCityFromAddress(address: string): string {
	const broken: string[] = address.split(", ");
	let city: string = broken.slice(broken.length - 3, broken.length - 1).join(", ");
	city = city.replace(/\s\d+/g, "");

	return city;
}
