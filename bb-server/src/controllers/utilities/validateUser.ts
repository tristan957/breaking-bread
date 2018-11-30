import { User } from "../../entities";

export function invalidUser(user: User): boolean {
	if (user === undefined || Object.keys(user).length === 0) { return true; }
	return false;
}
