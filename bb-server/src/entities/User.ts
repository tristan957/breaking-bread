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

    @Column({ type: "text" })
    public about: string;

    @Column()
    public email: string;

    @Column({ length: 16 })
    public phoneNumber: string;

    @CreateDateColumn()
    public createdAt: Date;

    // Each meal has one host but a user can host multiple meals
    @OneToMany(type => Meal, meal => meal.host)
    public hostedMeals: Meal[];

    // User has topics but topics are not unique to user
    @ManyToMany(type => Topic)
    @JoinTable()
    public whitelist: Topic[];

    // User has topics but topics are not unique to user
    @ManyToMany(type => Topic)
    @JoinTable()
    public blacklist: Topic[];

    @OneToMany(type => UserReview, review => review.subject)
    public reviewSubjectList: UserReview[];

    @OneToMany(type => UserReview, review => review.author)
    public userReviewsAuthored: UserReview[];

    @OneToMany(type => RecipeReview, review => review.author)
    public recipeReviewsAuthored: RecipeReview[];

    @OneToMany(type => Recipe, recipe => recipe.author)
    public recipesAuthored: Recipe[];
}
