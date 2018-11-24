import Recipe from "./Recipe";
import User from "./User";

type Meal = {
	id: number;
	title: string;
	price: number;
	description: string;
	location: string;
	startTime: Date;
	endTime: Date;
	maxGuests: number;
	imagePath: string;
	createdAt: Date;
	updatedAt: Date;
	host: Partial<User>;
	guests: Partial<User>[];
	recipes: Partial<Recipe>[];
};

export default Meal;
