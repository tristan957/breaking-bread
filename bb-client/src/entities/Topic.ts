import User from "./User";

type Topic = {
	id: number;
	name: string;
	blackListedBy: Partial<User>[];
	whiteListedBy: Partial<User>[];
};

export default Topic;
