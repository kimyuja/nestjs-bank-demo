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
import { PlusMinusBankDto } from './dto/plus-minus-bank.dto';
import { TransferBankDto } from './dto/transfer-bank.dto';

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
    @Patch('/plusminus')
    plusMinusBank(@Body() plusMinusBankDto: PlusMinusBankDto): Promise<number> {
        return this.banksService.plusMinusBank(plusMinusBankDto);
    }

    // 잔액 조회
    // 내 계좌 번호로 find 해서 그 것의 잔액 리턴
    @Get('/balance/:id')
    getBalance(@Param('id', ParseIntPipe) id: number, @GetUser() user: Users): Promise<number> {
        return this.banksService.getBalance(id, user);
    }

    // 계좌 이체
    // 이체 금액, 계좌 번호, 예금주 확인, 금액 이체할 내 계좌 번호, 금액 이체할 내 계좌의 잔액 조회. 까지 프론트에서 받아 옴 
    // -> 계좌 번호(혹은 계좌 아이디)로 findOne 해서 예금주 이름이랑 대조해 본 뒤 맞으면 
    // 내 입출금 통장에서 이체 금액만큼 빼서 해당 계좌에 넣기
    @Post('/transfer')
    transferBank(@Body() transferBankDto: TransferBankDto, @GetUser() user: Users): Promise<string> {
        return this.banksService.transferBank(transferBankDto, user);
    }

    // 거래 내역 조회
    @Get('/description/:id')
    getDescription(@Param('id', ParseIntPipe) id: number, @GetUser() user: Users): Promise<number[]> {
        return this.banksService.getDescription(id, user);
    }
}
