import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Recipe from "./Recipe";
import User from "./User";

@Entity()
export default class Meal {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public title: string;

	@Column({ type: "money" })
	public price: number;

	@Column({ length: 512, nullable: true })
	public description: string;

	@Column({ type: "text" })
	public location: string;

	@Column()
	public date: Date;

	@Column()
	public maxGuests: number;

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

	@ManyToMany(type => Recipe, recipe => recipe.mealsServedAt)
	@JoinTable()
	public recipes: Recipe[];
}
