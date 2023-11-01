import { BankStatus } from "../bank-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class PatchBankDto {

    @ApiProperty({
        example: 'S20 청년 입출금 통장, 마이홈 적금',
        description: '계좌 이름'
    })
    title: string;

    @ApiProperty({
        example: 'DEPOSIT, SAVINGS',
        description: '예금인지 적금인지 나타내는 필드'
    })
    status: BankStatus;
}