import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Meal from "./Meal";
import Recipe from "./Recipe";
import RecipeReview from "./RecipeReview";
import Topic from "./Topic";
import UserReview from "./UserReview";

@Entity()
@Unique(["email", "phoneNumber"])
export default class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public firstName: string;

    @Column()
    public lastName: string;

    @Column({ type: "text", nullable: true })
    public about: string;

    @Column()
    public email: string;

    @Column({ length: 16 })
    public phoneNumber: string;

    @CreateDateColumn()
    public createdAt: Date;

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

    @OneToMany(type => UserReview, review => review.subject)
    public reviews: UserReview[];

    @OneToMany(type => UserReview, review => review.author)
    public userReviewsAuthored: UserReview[];

    @OneToMany(type => RecipeReview, review => review.author)
    public recipeReviewsAuthored: RecipeReview[];

    @OneToMany(type => Recipe, recipe => recipe.author)
    public recipesAuthored: Recipe[];
}
