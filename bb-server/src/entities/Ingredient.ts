import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Allergen from "./Allergen";

@Entity()
@Unique(["name"])
export default class Ingredient {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @OneToMany(type => Allergen, allergen => allergen.id)
    public allergens: Allergen[];
}
