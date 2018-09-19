import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Review from "./Review";
import Topic from "./Topic";

@Entity()
@Unique(["email", "phoneNumber"])
export default class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: "text"})
    public name: string;

    @Column({type: "text"})
    public about: string;

    @Column({type: "varchar", length: 128})
    public email: string;

    @Column({type: "varchar", length: 16})
    public phoneNumber: string;

    @CreateDateColumn()
    public createdAt: Date;

    @OneToMany(type => Topic, topic => topic.id)
    public whitelist: Topic[];

    @OneToMany(type => Topic, topic => topic.id)
    public blacklist: Topic[];

    @OneToMany(type => Review, review => review.id)
    public reviews: Review[];
}
