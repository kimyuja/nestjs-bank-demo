import { Users } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { BankStatus } from "./bank-status.enum";
import { Bank } from "./bank.entity";
import { CreateBankDto as CreateBankDto } from "./dto/create-bank.dto";
import { UserRepository } from "src/auth/user.repository";

@EntityRepository(Bank)
export class BankRepository extends Repository<Bank> {
    // private readonly userRepository: UserRepository

    // async findByUserName(userName: string): Promise<Bank[]> {
    //     const found = (await this.userRepository.findOne({ where: { user: userName } })).banks
    //     return found;
    // }

    async createBank(createBankDto: CreateBankDto, user: Users, accountNumber: string, status: BankStatus): Promise<Bank> {
        const { title, description } = createBankDto;

        const bank = this.create({
            title,
            description,
            status,
            user,
            accountNumber,
        })

        await this.save(bank);
        return bank;
    }
}