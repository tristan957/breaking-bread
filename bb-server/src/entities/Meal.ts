import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    // Each meal has one host but a user can host multiple meals
    @ManyToOne(type => User, user => user.id)
    public host: User;

    // Meals have guests but quests are not unique to a meal
    @ManyToMany(type => User)
    @JoinTable()
    public guests: User[];

    // People should be able to share/re-use recipes. So recipes should not belong to one meal
    @ManyToMany(type => Recipe)
    @JoinTable()
    public recipes: Recipe[];
}
