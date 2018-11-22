import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Recipe from "./Recipe";
import User from "./User";

@Entity()
@Unique(["name"])
export default class Tag {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ length: 128 })
	public name: string;

	@ManyToMany(type => Recipe, recipe => recipe.tags)
	public associatedRecipes: Recipe[];

	@ManyToMany(type => User, user => user.followedTags)
	public followedBy: User[];
}
