import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Allergy from "./Allergy";

@Entity()
@Unique(["name"])
export default class Ingredient {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @ManyToMany(type => Allergy)
    @JoinTable()
    public allergies: Allergy[];
}
