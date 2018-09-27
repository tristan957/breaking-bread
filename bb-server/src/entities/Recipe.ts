import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Ingredient from "./Ingredient";
import Review from "./Review";
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

    @OneToOne(type => User, user => user.id)
    public author: User;

    @OneToMany(type => Review, review => review.id)
    public reviews: Review[];

    @OneToMany(type => Tag, tag => tag.id)
    public tags: Tag[];

    @OneToMany(type => Ingredient, ingredient => ingredient.id)
    public ingredients: Ingredient[];
}
