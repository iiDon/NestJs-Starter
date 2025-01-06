import { Body, Controller, Post, Res, Get, Req, UseGuards, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/login.dto';
import { Response, Request } from 'express';
import { RegisterDto } from '../user/dto/register.dto';
import { AuthRoleGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    await this.authService.register(body, res);
    return { success: true };
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    await this.authService.login(body, res);
    return { success: true };
  }

  @UseGuards(AuthRoleGuard([]))
  @Delete('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token: string = await req.cookies['session_id'];
    await this.authService.logout(token, res);
    return { success: true };
  }
}
