import { IsNotEmpty } from "class-validator";
import { BankStatus } from "../bank-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBankDto {
    @ApiProperty({
        example: 'S20 청년 입출금 통장, 마이홈 적금',
        description: '계좌 이름'
    })
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: '"0"',
        description: '초기 거래 내역 세팅'
    })
    @IsNotEmpty()
    description: number[];

    @ApiProperty({
        example: 'DEPOSIT, SAVINGS',
        description: '예금인지 적금 구별'
    })
    @IsNotEmpty()
    status: BankStatus;
}