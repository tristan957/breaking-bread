import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./User";

@Entity()
export default class UserReview {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "int4" })
    public rating: number;

    @Column({ type: "text", nullable: true })
    public description: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(type => User, user => user.reviews, { eager: true })
    public subject: User;

    @ManyToOne(type => User, user => user.userReviewsAuthored, { eager: true })
    public author: User;
}
