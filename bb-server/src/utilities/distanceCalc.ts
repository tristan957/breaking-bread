import { getDistanceSimple } from "geolib";
import { Meal, User } from "../entities";

export function userToMealMiles(user: User, meal: Meal): number {
	const [userLat, userLong]: string[] = user.latLong.split("|");
	const [mealLat, mealLong]: string[] = meal.latLong.split("|");

	return getDistanceSimple(
		{ latitude: userLat, longitude: userLong },
		{ latitude: mealLat, longitude: mealLong }
	) / 1609.344;
}
