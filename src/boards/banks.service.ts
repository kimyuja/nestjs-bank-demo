import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BankStatus } from './bank-status.enum';
import { CreateBankDto as CreateBankDto } from './dto/create-bank.dto';
import { BankRepository } from './bank.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { Users } from 'src/auth/user.entity';
import { PatchBankDto as PatchBankDto } from './dto/patch-bank.dto';
import { PlusMinusBankDto } from './dto/plus-minus-bank.dto';

@Injectable()
export class BanksService {
    constructor(
        @InjectRepository(BankRepository)
        private bankRepository: BankRepository,
    ) { }

    async getAllBanks(
        user: Users
    ): Promise<Bank[]> {
        const query = this.bankRepository.createQueryBuilder('bank');

        query.where('bank.userId = :userId', { userId: user.id });

        const banks = await query.getMany();

        return banks;
    }

    createBank(createBankDto: CreateBankDto, user: Users): Promise<Bank> {
        if (createBankDto.status == BankStatus.DEPOSIT) {
            // 예금 통장인 경우 앞자리가 110
            const accountNumber = "110-" + this.generate(3) + "-" + this.generate(6)
            return this.bankRepository.createBank(createBankDto, user, accountNumber, BankStatus.DEPOSIT);
        } else {
            // 적금 통장인 경우 앞자리가 223
            const accountNumber = "223-" + this.generate(3) + "-" + this.generate(6)
            return this.bankRepository.createBank(createBankDto, user, accountNumber, BankStatus.SAVINGS);
        }
    }

    // 계좌 번호 생성 시 n 자릿 수의 랜덤 숫자 생성해주는 함수
    generate(n: number) {
        let add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

        if (n > max) {
            return this.generate(max) + this.generate(n - max);
        }

        max = Math.pow(10, n + add);
        let min = max / 10; // Math.pow(10, n) basically
        let number = Math.floor(Math.random() * (max - min + 1)) + min;

        return ("" + number).substring(add);
    }

    // 계좌 아이디로 그 계좌만 불러오기
    async getBankById(id: number): Promise<Bank> {
        const found = await this.bankRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Can't find Bank with id ${id}`);
        }

        return found;
    }

    // 계좌 아이디로 그 계좌만 불러오기 + 유저 검증 절차
    async getBankByBankId(id: number, user: Users): Promise<Bank> {
        const found = await this.bankRepository.findOne(id, { relations: ["user"] });

        if (!found) {
            throw new NotFoundException(`Can't find Bank with id ${id}`);
        }


        // 조회하려는 user랑 bank 소유주랑 같은지 확인
        if ((found.user).id == user.id) {
            // return found; // 이렇게 하면 user 정보도 다 줘버림
            return await this.bankRepository.findOne(id);;
        } else {
            throw new ForbiddenException("You are only allowed to view your own account.")
        }

    }

    async deleteBank(id: number, user: Users): Promise<void> {
        const result = await this.bankRepository.delete({ id, user });

        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }
    }

    async updateBankStatus(id: number, status: BankStatus, patchBankDto: PatchBankDto): Promise<Bank> {
        const bank = await this.getBankById(id);

        bank.status = status;
        // 나중에 title 적기 귀찮으면 주석 해제해서 쓰기
        // if (patchBankDto.title == ""){
        //     if(status == BankStatus.DEPOSIT){
        //         bank.title = "예금"
        //     } else {
        //         bank.title = "적금"
        //     }
        // } else {
        //     bank.title = patchBankDto.title;
        // }
        bank.title = patchBankDto.title;

        if (status == BankStatus.DEPOSIT) {
            const accountNumber = "110-" + this.generate(3) + "-" + this.generate(6);
            bank.accountNumber = accountNumber;
        } else {
            const accountNumber = "223-" + this.generate(3) + "-" + this.generate(6);
            bank.accountNumber = accountNumber;
        }
        await this.bankRepository.save(bank);

        return bank;
    }

    async plusMinusBank(plusMinusBankDto: PlusMinusBankDto) {
        const { id, amount } = plusMinusBankDto;
        const found = await this.bankRepository.findOne(id)
        found.description.push(Number(amount));
        await this.bankRepository.save(found);
        let sum = "";
        for (let i = 0; i < found.description.length; i++) {
            const item = found.description[i];
            if (item[0] != "-") {
                const itemStr = "+" + item;
                sum += itemStr;
            } else {
                sum += item;
            }
        }
        console.log("sum: " + sum);
        //const sumInt = this.evaluateExpression(sum);
        const sumInt = this.evaluateExpression("+3000-1000+50000+1000-1000");
        return sumInt;
    }

    evaluateExpression(expression: string): number {
        // 문자열을 "+"와 "-"로 분할
        let parts = expression.split(/[\+\-]/);
        parts.shift();
        console.log("parts: " + parts);

        // 연산자를 추출하고 모든 숫자를 더합니다.
        const result = parts.reduce((total, part, index) => {
            const value = parseInt(part, 10);
            console.log("value: " + value);
            if (!isNaN(value)) {
                if (index === 0) {
                    return value;
                }
                const operator = expression[part.length + index];
                if (operator === '+') {
                    console.log("total: " + total + ", value: " + value + "total+value: " + (total + value));
                    return total + value;
                } else if (operator === '-') {
                    console.log("total: " + total + ", value: " + value + "total-value: " + (total - value));
                    return total - value;
                }
            }
            console.log("total: " + total);
            return total;
        }, 0);
        console.log("result: " + result);
        return result;
    }
}
