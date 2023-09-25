import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BankRepository } from './bank.repository';
import { BanksController } from './banks.controller';
import { BanksService as BanksService } from './banks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BankRepository]),
    AuthModule
  ],
  controllers: [BanksController],
  providers: [BanksService]
})
export class BoardsModule { }
