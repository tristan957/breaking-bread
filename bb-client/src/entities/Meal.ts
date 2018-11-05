// TODO: Needs title
type Meal = {
	id: number;
	title: string; // TODO: Change name to title in bb-server
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
