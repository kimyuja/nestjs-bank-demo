import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Bank } from 'src/boards/bank.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            // 유저 토큰 생성 ( Secret + Payload )
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        } else {
            throw new UnauthorizedException('login failed')
        }
    }

    // 유저 아이디로 그 유저의 계좌 모두 불러오기
    async getBanksByUserId(id: number): Promise<Bank[]> {
        const found = await this.userRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Can't find Bank with id ${id}`);
        }
        return found.banks;
    }

    async deleteUser(id: number): Promise<string> {
        const found = await this.userRepository.findOne(id);
        await this.userRepository.delete(id);
        return ("deleted user name : " + found.username);
    }
}
