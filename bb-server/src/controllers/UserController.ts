import { Controller, Mutation, Query } from "vesper";
import User from "../entities/User";
import UserReview from "../entities/UserReview";
import { UserRepository } from "../repositories";

@Controller()
export default class UserController {
	private userRepository: UserRepository;
	private currentUser: User;

	constructor(userRepository: UserRepository, user: User) {
		this.userRepository = userRepository;
		this.currentUser = user;
	}

	@Query()
	public user(args: IUserArgs): Promise<User | undefined> {
		return this.userRepository.findOne(args.id);
	}

	@Query()
	public userAuthenticated(): User {
		return this.currentUser;	// Will return undefined if auth fails
	}

	@Query()
	public userReview(args: IUserReviewArgs): Promise<UserReview | undefined> {

	}

	@Mutation()
	public userSave(args: IUserSaveArgs): Promise<User> {
		const user: User = this.userRepository.create(args);
		return this.userRepository.save(user);
	}

	@Mutation()
	public async userEdit(args: IUserEditArgs): Promise<User | undefined> {
		const user: User | undefined = await this.userRepository.findOne(args.id);
		if (user === undefined) { return undefined; }
		return await this.userRepository.save({ ...user, ...args });
	}

	@Mutation()
	public userDelete(args: IUserDeleteArgs): Promise<boolean> {

	}

	@Mutation()
	public userUpdateWhitelist(args: IUserUpdateTopiclistArgs): {

	}

	@Mutation()
	public userUpdateBlacklist(args: IUserUpdateTopiclistArgs): {

	}

	@Mutation()
	public userUpdateFollowedTags(args: IUserUpdateTagsArgs): {

	}

	@Mutation()
	public userToggleFollowing(args: IUserToggleFollowingArgs): {

	}

	@Mutation()
	public userToggleSavedRecipe(args: IUserToggleSavedRecipeArgs): {

	}

	@Mutation()
	public userReviewSave(args: IUserReviewSaveArgs): {

	}

	@Mutation()
	public userReviewEdit(args: IUserReviewEditArgs): {

	}

}

interface IUserArgs {
	id: number;
}

interface IUserSaveArgs {
	firstName: string;
	lastName: string;
	imagePath: string;
	about: string;
	email: string;
	phoneNumber: string;
}

interface IUserEditArgs {
	id: number;
	imagePath: string;
	about: string;
	email: string;
	phoneNumber: string;
}
