import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Failed to connect to the database');
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }

      process.exit(1);
    }
  }
}
