import { Controller, Mutation, Query } from "vesper";
import { IInput } from "../args";
import { DropLatLong } from "../args/CommonArgs";
import { IUserArgs, IUserEditArgs, IUserReviewArgs, IUserReviewEditArgs, IUserReviewSaveArgs, IUserSaveArgs, IUserToggleTagsArgs, IUserToggleTopiclistArgs } from "../args/UserControllerArgs";
import { Recipe, Tag, Topic, User, UserReview } from "../entities";
import { RecipeRepository, UserRepository, UserReviewRepository } from "../repositories";
import { toggleItemByID } from "../repositories/utilities/toggleByID";
import { getLocationByCoords, LocationEntry } from "../utilities/locationInformation";

@Controller()
export default class UserController {
	private userRepository: UserRepository;
	private userReviewRepository: UserReviewRepository;
	private recipeRepository: RecipeRepository;
	private currentUser: User;

	constructor(userRepository: UserRepository, userReviewRepository: UserReviewRepository, recipeRepository: RecipeRepository, user: User) {
		this.userRepository = userRepository;
		this.userReviewRepository = userReviewRepository;
		this.recipeRepository = recipeRepository;
		this.currentUser = user;
	}

	@Query()
	public user(args: IUserArgs): Promise<User | undefined> {
		return this.userRepository.findOne(args.id);
	}

	@Query()
	public userAuthenticated(): User | undefined {
		if (this.currentUser === undefined) { return undefined; }
		return this.currentUser;	// Will return undefined if auth fails
	}

	@Query()
	public userReview(args: IUserReviewArgs): Promise<UserReview | undefined> {
		return this.userReviewRepository.findOne(args.id);
	}

	@Mutation()
	public async userSave(args: IInput<IUserSaveArgs>): Promise<User | undefined> { // Some sort of verification, maybe email
		const { latLong, ...inputNoLatLong }: DropLatLong<IUserSaveArgs> = args.input;
		const locationInfo: LocationEntry = await getLocationByCoords(latLong.lat, latLong.long);
		if (locationInfo.formattedAddress === undefined) { return undefined; }

		const user: User = this.userRepository.create({
			...inputNoLatLong,
			latLong: `${latLong.lat}|${latLong.long}`,
			location: locationInfo.formattedAddress,
		});
		return this.userRepository.save(user);
	}

	@Mutation()
	public async userEdit(args: IInput<IUserEditArgs>): Promise<User | undefined> {
		if (this.currentUser === undefined) { return undefined; }

		const { latLong, ...inputNoLatLong }: DropLatLong<IUserEditArgs> = args.input;
		if (latLong !== undefined) {
			const locationInfo: LocationEntry = await getLocationByCoords(latLong.lat, latLong.long);
			if (locationInfo.formattedAddress === undefined) { return undefined; }

			return this.userRepository.save({
				...this.currentUser,
				...inputNoLatLong,
				latLong: `${latLong.lat}|${latLong.long}`,
				location: locationInfo.formattedAddress,
			});
		}

		return this.userRepository.save({
			...this.currentUser,
			...inputNoLatLong,
		});
	}

	@Mutation()
	public async userDelete(): Promise<boolean | undefined> { // Maybe prompt on front-end first
		if (this.currentUser === undefined) { return undefined; }
		await this.userRepository.remove(this.currentUser);
		return true;
	}

	@Mutation()		// TODO: Remove from opposite list if it exists, before inserting into requested list
	public userToggleWhitelist(args: IUserToggleTopiclistArgs): Promise<Topic[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		return this.userRepository.toggleWhitelist(this.currentUser, args.topics);
	}

	@Mutation()
	public userToggleBlacklist(args: IUserToggleTopiclistArgs): Promise<Topic[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		return this.userRepository.toggleBlacklist(this.currentUser, args.topics);
	}

	@Mutation()
	public userToggleFollowedTags(args: IUserToggleTagsArgs): Promise<Tag[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		return this.userRepository.toggleFollowedTags(this.currentUser, args.tags);
	}

	@Mutation()
	public async userToggleFollowing(args: IUserArgs): Promise<User[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		const fullUser: User = await this.userRepository.findOne(this.currentUser.id, { relations: ["followedUsers"] });
		const toFollow: User | undefined = await this.userRepository.findOne(args.id);
		if (toFollow === undefined) { return undefined; }

		toggleItemByID(fullUser.followedUsers, toFollow);
		await this.userRepository.save(fullUser);
		return fullUser.followedUsers;
	}

	@Mutation()
	public async userToggleSavedRecipe(args: IUserArgs): Promise<Recipe[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		const fullUser: User = await this.userRepository.findOne(this.currentUser.id, { relations: ["savedRecipes"] });
		const toSave: Recipe | undefined = await this.recipeRepository.findOne(args.id);
		if (toSave === undefined) { return undefined; }

		toggleItemByID(fullUser.savedRecipes, toSave);
		await this.userRepository.save(fullUser);
		return fullUser.savedRecipes;
	}

	@Mutation()
	public async userReviewSave(args: IInput<IUserReviewSaveArgs>): Promise<UserReview | undefined> {
		if (this.currentUser === undefined) { return undefined; }	// Need to check if user was in a past attended meal
		const subject: User | undefined = await this.userRepository.findOne(args.input.subjectID);
		if (subject === undefined) { return undefined; }

		const review: UserReview | undefined = await this.userReviewRepository.findOne({
			where: {
				subject: {
					id: args.input.subjectID,
				},
				author: {
					id: this.currentUser.id,
				},
			},
		});

		return review === undefined ? this.userReviewRepository.save(this.userReviewRepository.create({
			...args.input,
			author: this.currentUser,
			subject,
		})) : review;
	}

	@Mutation()
	public async userReviewEdit(args: IInput<IUserReviewEditArgs>): Promise<UserReview | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		const review: UserReview | undefined = await this.userReviewRepository.findOne(args.input.id, { relations: ["author"] });

		if (this.currentUser.id !== review.author.id) { return undefined; }

		return review === undefined ? undefined : this.userReviewRepository.save(
			{
				...review,
				...args.input,
			}
		);
	}
}
