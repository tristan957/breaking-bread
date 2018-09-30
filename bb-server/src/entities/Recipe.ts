import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Ingredient from "./Ingredient";
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

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    // User can write more than one review
    @ManyToOne(type => User, user => user.recipesAuthoredList)
    public author: User;

    @OneToMany(type => RecipeReview, review => review.subject)
    public reviewsList: RecipeReview[];

    @ManyToMany(type => Tag)
    @JoinTable()
    public tags: Tag[];

    @ManyToMany(type => Ingredient)
    @JoinTable()
    public ingredients: Ingredient[];
}
