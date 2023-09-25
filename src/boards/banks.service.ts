import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BankStatus } from './bank-status.enum';
import { CreateBankDto as CreateBankDto } from './dto/create-bank.dto';
import { BankRepository } from './bank.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { Users } from 'src/auth/user.entity';

@Injectable()
export class BanksService {
    constructor(
        @InjectRepository(BankRepository)
        private bankRepository: BankRepository,
    ) { }
    // getAllBoards(): Board[] {
    //     return this.boards;
    // }

    async getAllBanks(
        user: Users
    ): Promise<Bank[]> {
        const query = this.bankRepository.createQueryBuilder('bank');

        query.where('bank.userId = :userId', { userId: user.id });

        const banks = await query.getMany();

        return banks;
    }

    // createBoard(createBoardDto: CreateBoardDto) {
    //     const { title, description } = createBoardDto;

    //     const board: Board = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     }

    //     this.boards.push(board);
    //     return board;
    // }

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

    // getBoardById(id: string): Board {
    //     const found = this.boards.find((board) => board.id === id);

    //     if (!found) {
    //         throw new NotFoundException(`Can't find Board with id ${id}`);
    //     }

    //     return found;
    // }

    async deleteBank(id: number, user: Users): Promise<void> {
        const result = await this.bankRepository.delete({ id, user });

        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }
    }

    // deleteBoard(id: string): void {
    //     const found = this.getBoardById(id);
    //     this.boards = this.boards.filter((board) => board.id !== found.id);
    // }


    async updateBankStatus(id: number, status: BankStatus): Promise<Bank> {
        const bank = await this.getBankById(id);

        bank.status = status;
        await this.bankRepository.save(bank);

        return bank;
    }
    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }

}
