import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Allergy from "./Allergy";
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

    @Column({ type: "text" })
    public recipeImageS3Key: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(type => User, user => user.recipesAuthored, { eager: true })
    public author: User;

    @Column()
    public timesFavorited: number;

    @OneToMany(type => RecipeReview, review => review.subject)
    public reviews: RecipeReview[];

    @ManyToMany(type => Tag)
    @JoinTable()
    public tags: Tag[];

    @ManyToMany(type => Ingredient)
    @JoinTable()
    public ingredients: Ingredient[];

    @ManyToMany(type => Allergy)
    @JoinTable()
    public allergies: Allergy[];
}
