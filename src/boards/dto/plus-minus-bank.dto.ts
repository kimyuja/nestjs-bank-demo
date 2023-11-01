import { ApiProperty } from "@nestjs/swagger";

export class PlusMinusBankDto {

    @ApiProperty({
        example: '1',
        description: '계좌 생성 할 때 마다 1씩 증가하는 숫자 번호'
    })
    id: number;

    @ApiProperty({
        example: '20000',
        description: '금액'
    })
    amount: number;
}