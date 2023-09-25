import { Body, Controller, Post, Get, UseGuards, ValidationPipe, Param, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { GetUser } from './get-user.decorator';
import { Users } from './user.entity';
import { Bank } from 'src/boards/bank.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    signUp(@Body(ValidationPipe) authcredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authcredentialsDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: Users) {
        console.log('user', user);
    }

    // 본인 계좌(list)만 보게 하기, 이 때 파라미터의 id는 유저의 id.
    @Get('/private/:userid')
    @UseGuards(AuthGuard())
    getBankByUserId(@Param('userid') id: number, @GetUser() user: Users): Promise<Bank[]> {
        console.log(user);
        if (user.id == id) {
            return this.authService.getBanksByUserId(id);
        } else {
            throw new ForbiddenException("You are only allowed to view your own account.")
        }
    }

}

