import { Body, Controller, Delete, ForbiddenException, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Users } from 'src/auth/user.entity';
import { BankStatus } from './bank-status.enum';
import { Bank } from './bank.entity';
import { BanksService as BanksService } from './banks.service';
import { CreateBankDto as CreateBankDto } from './dto/create-bank.dto';
import { BoardStatusValidationPipe as BankStatusValidationPipe } from './pipes/bank-status-validation.pipe';
import { PatchBankDto as PatchBankDto } from './dto/patch-bank.dto';

@Controller('banks')
@UseGuards(AuthGuard())
export class BanksController {
    private logger = new Logger('Banks');
    constructor(private banksService: BanksService) { }

    @Get()
    getAllBank(
        @GetUser() user: Users
    ): Promise<Bank[]> {
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.banksService.getAllBanks(user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBank(@Body() createBankDto: CreateBankDto,
        @GetUser() user: Users): Promise<Bank> {
        this.logger.verbose(`User ${user.username} creating a new account. 
        Payload: ${JSON.stringify(createBankDto)} `)
        return this.banksService.createBank(createBankDto, user);
    }

    // 본인 계좌 하나만 보게 하기, 이 때 파라미터의 id는 계좌의 id.
    @Get('/:bankid')
    getBankByBankId(@Param('bankid') id: number, @GetUser() user: Users): Promise<Bank> {
        return this.banksService.getBankByBankId(id, user);
    }

    @Delete('/:id')
    deleteBank(@Param('id', ParseIntPipe) id,
        @GetUser() user: Users
    ): Promise<void> {
        return this.banksService.deleteBank(id, user);
    }

    @Patch('/:id/status')
    updateBankStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BankStatusValidationPipe) status: BankStatus,
        @Body() patchBankDto: PatchBankDto
    ) {
        return this.banksService.updateBankStatus(id, status, patchBankDto);
    }

    // 입출금 기능

    // 계좌 이체

    // 잔액 조회

}
