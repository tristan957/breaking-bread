import { Check, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Recipe from "./Recipe";
import User from "./User";

@Entity()
@Check(`"rating" >= 1 AND "rating" <= 5`)
export default class RecipeReview {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "int4" })
	public rating: number;

	@Column({ type: "text", nullable: true })
	public description: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@ManyToOne(type => Recipe, recipe => recipe.reviews)
	public subject: Recipe;

	@ManyToOne(type => User, user => user.recipeReviewsAuthored)
	public author: User;
}
