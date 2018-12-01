export function getCityFromAddress(address: string): string {
	const broken: string[] = address.split(", ");
	let city: string = broken.slice(broken.length - 3, broken.length - 1).join(", ");
	city = city.replace(/\s\d+/g, "");

	return city;
}
