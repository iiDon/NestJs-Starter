import { Body, Controller, Post, Res, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/login.dto';
import { Response, Request } from 'express';
import { SessionService } from './session.service';
import { RegisterDto } from '../user/dto/register.dto';
import { AuthRoleGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.register(body);
    this.sessionService.setSessionCookie(res, token);
    return { success: true };
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.login(body);
    this.sessionService.setSessionCookie(res, token);
    return { success: true };
  }

  @UseGuards(AuthRoleGuard([]))
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['session_id'];
    await this.authService.logout(token);
    this.sessionService.clearSessionCookie(res);
    return { success: true };
  }
}
