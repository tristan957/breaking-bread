import Recipe from "./Recipe";
import User from "./User";

type Meal = {
	id: number;
	location: string;
	date: Date;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	host: User;
	guests: User[];
	recipes: Recipe[];
};

export default Meal;
