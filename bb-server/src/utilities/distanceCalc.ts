import { getDistanceSimple } from "geolib";
import { Meal, User } from "../entities";

export function userToMealMiles(user: User, meal: Meal): number {
	const [userLat, userLong]: string[] = user.latLong.split("|");
	const [mealLat, mealLong]: string[] = meal.latLong.split("|");

	const rawDistance: number = getDistanceSimple(
		{ latitude: userLat, longitude: userLong },
		{ latitude: mealLat, longitude: mealLong }
	) / 1609.344;

	const rounded: number = parseFloat((Math.round(rawDistance * 4) / 4).toFixed(2));

	return rounded;
}
