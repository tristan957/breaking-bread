import Recipe from "./Recipe";
import User from "./User";

type Meal = {
	id: number;
	title: string;
	price: number;
	description: string;
	city: string;
	startTime: number;
	endTime: number;
	guestCount: number;
	maxGuests: number;
	imagePath: string | null;
	createdAt: number;
	updatedAt: number;
	host: Partial<User>;
	guests: Partial<User>[];
	recipes: Partial<Recipe>[];
};

export default Meal;
