import { Users } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BankStatus } from "./bank-status.enum";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Bank extends BaseEntity {
    @ApiProperty({
        example: '1',
        description: '계좌 생성 할 때 마다 1씩 증가하는 숫자 번호'
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'S20 청년 입출금 통장, 마이홈 적금',
        description: '계좌 이름'
    })
    @Column()
    title: string;

    @ApiProperty({
        example: '[0,3000,-2000]',
        description: '거래 내역'
    })
    @Column('simple-array')
    description: number[];

    @ApiProperty({
        example: 'DEPOSIT, SAVINGS',
        description: '예금인지 적금인지 나타내는 필드'
    })
    @Column()
    status: BankStatus;

    @ApiProperty({
        example: '예금은 110으로 시작, 적금은 223으로 시작. ex) 110-123-123456',
        description: '계좌 번호'
    })
    @Column()
    accountNumber: string;


    @ManyToOne(type => Users, user => user.banks, { eager: false })
    user: Users;

    @ApiProperty({
        example: '123456',
        description: '잔액. description에 있는 걸 모두 더한 값.'
    })
    @Column()
    balance: number;
}