import { Body, Controller, Delete, ForbiddenException, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Users } from 'src/auth/user.entity';
import { BankStatus } from './bank-status.enum';
import { Bank } from './bank.entity';
import { BanksService as BanksService } from './banks.service';
import { CreateBankDto as CreateBankDto } from './dto/create-bank.dto';
import { BoardStatusValidationPipe as BankStatusValidationPipe } from './pipes/bank-status-validation.pipe';

@Controller('banks')
@UseGuards(AuthGuard())
export class BanksController {
    private logger = new Logger('Banks');
    constructor(private banksService: BanksService) { }

    // @Get('/')
    // getAllBoard(): Board[] {
    //     return this.boardsService.getAllBoards();
    // }

    @Get()
    getAllBank(
        @GetUser() user: Users
    ): Promise<Bank[]> {
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.banksService.getAllBanks(user);
    }

    // @Post()
    // @UsePipes(ValidationPipe)
    // createBoard(
    //     @Body() createBoardDto: CreateBoardDto
    // ): Board {
    //     return this.boardsService.createBoard(createBoardDto);
    // }

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

    // @Delete('/:id')
    // deleteBoard(@Param('id') id: string): void {
    //     this.boardsService.deleteBoard(id);
    // }

    @Patch('/:id/status')
    updateBankStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BankStatusValidationPipe) status: BankStatus
    ) {
        return this.banksService.updateBankStatus(id, status);
    }

}
