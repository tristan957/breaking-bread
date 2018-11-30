import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Recipe from "./Recipe";
import User from "./User";

@Entity()
export default class Meal {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public title: string;

	@Column({ type: "numeric" })
	public price: number;

	@Column({ length: 512, nullable: true })
	public description: string;

	@Column()
	public latLong: string;

	@Column({ type: "text" })
	public location: string;

	public city: string;  // TODO: Resolver for graphql. Just display the city, state

	public relativeDistance: number;

	@Column()
	public startTime: Date;

	@Column()
	public endTime: Date;

	@Column({ type: "text", nullable: true })
	public imagePath: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@ManyToOne(type => User)
	public host: User;

	@ManyToMany(type => User, user => user.mealsAttending)
	@JoinTable()
	public guests: User[];

	public guestCount: number;

	@Column()
	public maxGuests: number;

	public isFull: boolean;

	@ManyToMany(type => Recipe, recipe => recipe.mealsServedAt)
	@JoinTable()
	public recipes: Recipe[];
}
