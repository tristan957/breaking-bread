import Recipe from "./Recipe";
import User from "./User";

type Meal = {
	id: number;
	title: string;
	description: string;
	imagePath: string;
	location: string;
	numberOfGuests: number;
	date: Date;
	createdAt: Date;
	updatedAt: Date;
	host: Partial<User>;
	guests: Partial<User>[];
	recipes: Partial<Recipe>[];
};

export default Meal;
