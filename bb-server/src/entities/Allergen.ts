import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["name"])
export default class Allergen {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 128 })
    public name: string;
}
