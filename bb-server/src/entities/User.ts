import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import Meal from "./Meal";
import Recipe from "./Recipe";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import Topic from "./Topic";
import UserReview from "./UserReview";

@Entity()
@Unique(["oAuthSub", "imagePath", "email", "phoneNumber"])
export default class User {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public firstName: string;

	@Column()
	public lastName: string;

	public name: string;

	@Column({ type: "text", nullable: true })
	public imagePath: string;

	@Column({ length: 255 })
	public oAuthSub: string;

	@Column({ type: "text", nullable: true })
	public about: string;

	@Column()
	public latLong: string;

	@Column({ type: "text" })
	public location: string;

	public homeTown: string;

	@Column()
	public email: string;

	@Column({ length: 16 })
	public phoneNumber: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@OneToMany(type => Meal, meal => meal.host)
	public hostedMeals: Meal[];

	@ManyToMany(type => Meal, meal => meal.guests)
	public mealsAttending: Meal[];

	public upcomingMeals: Meal[];

	@ManyToMany(type => Topic, topic => topic.whiteListedBy)
	@JoinTable()
	public whitelist: Topic[];

	@ManyToMany(type => Topic, topic => topic.blackListedBy)
	@JoinTable()
	public blacklist: Topic[];

	@ManyToMany(type => Recipe, recipe => recipe.savedBy)
	@JoinTable()
	public savedRecipes: Recipe[];

	@ManyToMany(type => User, user => user.followers)
	@JoinTable()
	public followedUsers: User[];

	@ManyToMany(type => User, user => user.followedUsers)
	public followers: User[];

	public numberOfFollowers: number;

	@ManyToMany(type => Tag, tag => tag.followers)
	@JoinTable()
	public followedTags: Tag[];

	@OneToMany(type => UserReview, review => review.subject)
	public reviews: UserReview[];

	public reviewAverage: number;

	@OneToMany(type => UserReview, review => review.author)
	public authoredUserReviews: UserReview[];

	@OneToMany(type => RecipeReview, review => review.author)
	public authoredRecipeReviews: RecipeReview[];

	@OneToMany(type => Recipe, recipe => recipe.author)
	public authoredRecipes: Recipe[];
}
