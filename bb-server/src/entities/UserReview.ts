import { Check, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./User";

@Entity()
@Check(`"rating" >= 1 AND "rating" <= 5`)
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

	@ManyToOne(type => User, user => user.reviews)
	public subject: User;

	@ManyToOne(type => User, user => user.userReviewsAuthored)
	public author: User;
}
