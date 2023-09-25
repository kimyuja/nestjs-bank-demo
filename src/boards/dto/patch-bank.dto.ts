import { BankStatus } from "../bank-status.enum";

export class PatchBankDto {
    title: string;

    status: BankStatus;
}