import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @Column({ type: "text" })
    public description: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @OneToOne(type => User, user => user.id)
    public host: User;

    @OneToMany(type => User, user => user.id)
    public guests: User[];
}
