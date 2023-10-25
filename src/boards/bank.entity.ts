import { Users } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BankStatus } from "./bank-status.enum";

@Entity()
export class Bank extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('simple-array')
    description: number[];

    @Column()
    status: BankStatus;

    @Column()
    accountNumber: string;

    @ManyToOne(type => Users, user => user.banks, { eager: false })
    user: Users;
}