import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppLogger } from 'src/common/services/logger.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AppLogger],
  exports: [UsersService],
})
export class UsersModule {}
