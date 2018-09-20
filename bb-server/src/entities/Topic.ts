import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["name"])
export default class Topic {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 128 })
    public name: string;
}
