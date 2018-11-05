type Meal = {
	id: number;
	title: string;
	description: string; // TODO: Add to bb-server as text size 512
	imagePath: string;
	location: string;
	numberOfGuests: number;
	date: Date;
	createdAt: Date;
	updatedAt: Date;
	hostID: number;
	guestIDs: number[];
	recipeIDs: number[];
};

export default Meal;
