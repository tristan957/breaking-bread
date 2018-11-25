import User from "./User";

type UserReview = {
	id: number;
	rating: number;
	description: string;
	createdAt: number;
	updatedAt: number;
	subject: Partial<User>;
	author: Partial<User>;
};

export default UserReview;
