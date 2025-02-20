import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string, withException = true) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user && withException) {
      throw new NotFoundException('Invalid Credentials');
    }

    return user;
  }

  async create(email: string, password: string) {
    const exist = await this.findOne(email, false);

    if (exist) {
      throw new NotFoundException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        password,
      },
    });

    return user;
  }
}
