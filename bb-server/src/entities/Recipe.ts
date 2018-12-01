import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Allergy from "./Allergy";
import Meal from "./Meal";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import User from "./User";

@Entity()
export default class Recipe {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public name: string;

	@Column({ type: "text" })
	public description: string;

	@Column({ type: "text", nullable: true })
	public imagePath: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@ManyToOne(type => User, user => user.authoredRecipes)
	public author: User;

	@ManyToMany(type => User, user => user.savedRecipes)
	public savedBy: User[];

	public timesSaved: number;

	@OneToMany(type => RecipeReview, review => review.subject)
	public reviews: RecipeReview[];

	public reviewAverage: number;

	@ManyToMany(type => Meal, meal => meal.recipes)
	public mealsServedAt: Meal[];

	@ManyToMany(type => Tag, tag => tag.associatedRecipes)  // For use with MealFeed
	@JoinTable()
	public tags: Tag[];

	@ManyToMany(type => Allergy)
	@JoinTable()
	public allergies: Allergy[];
}
