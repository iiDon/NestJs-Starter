import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { SessionService } from './session.service';
import { RegisterDto } from '../user/dto/register.dto';
import { LoginDto } from '../user/dto/login.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async register({ email, password }: RegisterDto, res: Response) {
    const hash = await this.hashPassword(password);
    const user = await this.usersService.create(email, hash);
    const { token } = await this.sessionService.createSession(user.id);
    this.sessionService.setSessionCookie(res, token);
    return;
  }

  async login({ email, password }: LoginDto, res: Response) {
    const user = await this.usersService.findOne(email);
    await this.verifyPassword(password, user.password);
    const { token } = await this.sessionService.createSession(user.id);
    this.sessionService.setSessionCookie(res, token);
    return;
  }

  async logout(token: string, res: Response) {
    await this.sessionService.deleteSession(token);
    return this.sessionService.clearSessionCookie(res);
  }

  private async hashPassword(password: string) {
    return await argon2.hash(password);
  }

  private async verifyPassword(password: string, hash: string) {
    const isValid = await argon2.verify(hash, password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return true;
  }
}
