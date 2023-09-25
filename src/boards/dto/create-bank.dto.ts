import { IsNotEmpty } from "class-validator";
import { BankStatus } from "../bank-status.enum";

export class CreateBankDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    status: BankStatus;
}