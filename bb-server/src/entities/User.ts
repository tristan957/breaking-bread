import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import Meal from "./Meal";
import Recipe from "./Recipe";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import Topic from "./Topic";
import UserReview from "./UserReview";

@Entity()
@Unique(["oAuthSub", "profilePictureS3Key", "email", "phoneNumber"])
export default class User {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public firstName: string;

	@Column()
	public lastName: string;

	@Column({ type: "text" })
	public profilePictureS3Key: string;

	@Column({ length: 255 })
	public oAuthSub: string;

	@Column({ type: "text", nullable: true })
	public about: string;

	@Column()
	public email: string;

	@Column({ length: 16 })
	public phoneNumber: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public timesFavorited: number;

	@OneToMany(type => Meal, meal => meal.host)
	public hostedMeals: Meal[];

	@ManyToMany(type => Topic)
	@JoinTable()
	public whitelist: Topic[];

	@ManyToMany(type => Topic)
	@JoinTable()
	public blacklist: Topic[];

	@ManyToMany(type => Recipe)
	@JoinTable()
	public favoriteRecipes: Recipe[];

	@ManyToMany(type => User)
	@JoinTable()
	public favoriteUsers: User[];

	@ManyToMany(type => Tag)
	@JoinTable()
	public favoriteTags: Tag[];

	@OneToMany(type => UserReview, review => review.subject)
	public reviews: UserReview[];

	@OneToMany(type => UserReview, review => review.author)
	public userReviewsAuthored: UserReview[];

	@OneToMany(type => RecipeReview, review => review.author)
	public recipeReviewsAuthored: RecipeReview[];

	@OneToMany(type => Recipe, recipe => recipe.author)
	public recipesAuthored: Recipe[];
}
