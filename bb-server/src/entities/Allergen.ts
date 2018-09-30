import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import Ingredient from "./Ingredient";

// These should not be user defined
// That or parsed and stemmed so we don't have multiple of the same
@Entity()
@Unique(["name"])
export default class Allergen {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 128 })
    public name: string;
}
