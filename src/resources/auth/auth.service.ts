import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { throwError } from 'src/utils/throwError';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    try {
      const hash = await this.hashPassword(password);
      const user = await this.usersService.create(email, hash);
      const payload = { email: user.email, sub: user.id };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throwError(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.usersService.findOne(email);
      await this.verifyPassword(password, user.password);

      return {
        token: this.jwtService.sign({ email: user.email, sub: user.id }),
      };
    } catch (error) {
      throwError(error);
    }
  }

  private hashPassword(password: string) {
    return argon2.hash(password);
  }

  private async verifyPassword(password: string, hash: string) {
    try {
      const valid = await argon2.verify(hash, password);
      console.log(valid);
      if (!valid) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      return valid;
    } catch (error) {
      throwError(error);
    }
  }
}
