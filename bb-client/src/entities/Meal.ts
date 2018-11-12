import Recipe from "./Recipe";
import User from "./User";

type Meal = {
	id: number;
	title: string;
	price: number;  // TODO: Add to db if not in there already (undefined/null if meal is free)
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
