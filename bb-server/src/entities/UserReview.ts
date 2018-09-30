import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

@Entity()
export default class UserReview {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "int4" })
    public rating: number;

    @Column({ type: "text" })
    public description: string;

    @CreateDateColumn()
    public createdAt: Date;

    // Needed for foreign key creation
    @ManyToOne(type => User, user => user.reviewSubjectList)
    public subject: User;

    @ManyToOne(type => User, user => user.userReviewsAuthored)
    public author: User;
}
