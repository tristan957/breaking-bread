import User from "./User";

type UserReview = {
	id: number;
	rating: number;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	subject: User;
	author: User;
};

export default UserReview;
