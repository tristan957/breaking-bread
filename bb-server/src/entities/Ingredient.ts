import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["name"])
export default class Ingredient {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: "varchar", length: 256})
    public name: string;
}
