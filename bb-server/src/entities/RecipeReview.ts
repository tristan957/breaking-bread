import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Recipe from "./Recipe";
import User from "./User";

@Entity()
export default class RecipeReview {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "int4" })
    public rating: number;

    @Column({ type: "text" })
    public description: string;

    @CreateDateColumn()
    public createdAt: Date;

    @ManyToOne(type => Recipe, recipe => recipe.reviews)
    public subject: Recipe;

    @ManyToOne(type => User, user => user.recipeReviewsAuthored)
    public author: User;
}
