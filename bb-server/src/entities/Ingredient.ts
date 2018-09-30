import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Allergen from "./Allergen";

@Entity()
@Unique(["name"])
export default class Ingredient {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    // Has multiple allergens, while allergens are not unique to an ingredient
    @ManyToMany(type => Allergen)
    @JoinTable()
    public allergens: Allergen[];
}
