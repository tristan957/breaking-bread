import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Recipe from "./Recipe";
import User from "./User";

@Entity()
export default class Meal {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "text" })
    public location: string;

    @Column({ type: "timestamp" })
    public date: Date;

    @Column()
    public name: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @OneToOne(type => User, user => user.id)
    public host: User;

    @OneToMany(type => User, user => user.id)
    public guests: User[];

    @OneToMany(type => Recipe, recipe => recipe.id)
    public recipes: Recipe[];
}
