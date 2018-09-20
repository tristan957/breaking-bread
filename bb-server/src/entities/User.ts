import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Review from "./Review";
import Topic from "./Topic";

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

    @OneToMany(type => Topic, topic => topic.id)
    public whitelist: Topic[];

    @OneToMany(type => Topic, topic => topic.id)
    public blacklist: Topic[];

    @OneToMany(type => Review, review => review.id)
    public reviews: Review[];
}
