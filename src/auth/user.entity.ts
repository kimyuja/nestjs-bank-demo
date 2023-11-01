import { Bank as Bank } from "src/boards/bank.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
@Unique(['username'])
export class Users extends BaseEntity {

    @ApiProperty({
        example: '1',
        description: '유저 생성 할 때 마다 1씩 증가하는 숫자 번호'
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'apple123',
        description: '유저 아이디'
    })
    @Column()
    username: string;

    @ApiProperty({
        example: '1234',
        description: '유저 비밀번호'
    })
    @Column()
    password: string;

    @OneToMany(type => Bank, bank => bank.user, { eager: true })
    banks: Bank[]
}