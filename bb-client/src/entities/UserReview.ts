import User from "./User";

type UserReview = {
	id: number;
	rating: number;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	subject: Partial<User>;
	author: Partial<User>;
};

export default UserReview;
