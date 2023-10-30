export class TransferBankDto {
    // 돈 송금 받는 계좌 번호
    id: number;
    // 송금하려는 금액
    amount: number;
    // 송금하려는 계좌의 예금주
    holderName: string;
    // 내 계좌 중 출금 당하는 계좌의 번호
    myId: number
}