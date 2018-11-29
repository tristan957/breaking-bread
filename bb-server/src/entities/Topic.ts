import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import User from "./User";

@Entity()
@Unique(["name"])
export default class Topic {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ length: 128 })
	public name: string;

	@ManyToMany(type => User, user => user.blacklist)
	public blackListedBy: User[];

	@ManyToMany(type => User, user => user.whitelist)
	public whiteListedBy: User[];
}
