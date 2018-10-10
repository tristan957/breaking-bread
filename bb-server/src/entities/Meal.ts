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

    @ManyToOne(type => User, { eager: true })
    public host: User;

    @ManyToMany(type => User)
    @JoinTable()
    public guests: User[];

    @ManyToMany(type => Recipe)
    @JoinTable()
    public recipes: Recipe[];
}
