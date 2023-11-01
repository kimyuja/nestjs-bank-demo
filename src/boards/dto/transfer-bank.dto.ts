import { ApiProperty } from "@nestjs/swagger";

export class TransferBankDto {

    @ApiProperty({
        example: '110-123-123456',
        description: '돈 송금 받는 계좌 번호'
    })
    id: number;

    @ApiProperty({
        example: '120000',
        description: '송금하려는 금액'
    })
    amount: number;

    @ApiProperty({
        example: 'apple134',
        description: '송금하려는 계좌의 예금주'
    })
    holderName: string;

    @ApiProperty({
        example: '110-456-789012',
        description: '내 계좌 중 출금 당하는 계좌의 번호'
    })
    myId: number
}