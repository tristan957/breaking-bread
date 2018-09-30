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

    // Needed for foreign key creation
    @ManyToOne(type => Recipe, recipe => recipe.reviewsList)
    public subject: Recipe;

    @ManyToOne(type => User, user => user.recipeReviewList)
    public author: User;
}
