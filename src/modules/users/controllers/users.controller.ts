import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'generated/prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../entities/user.entity';

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  async findAll(): Promise<(User & { full_name: string })[]> {
    const users = await this.usersService.findAll();
    const instances = plainToInstance(UserEntity, users, {
      excludeExtraneousValues: true,
    });
    return instances as unknown as (User & { full_name: string })[];
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<(User & { full_name: string }) | null> {
    const user = await this.usersService.findById(id);
    if (!user) return null;
    const instance = plainToInstance(UserEntity, user, {
      excludeExtraneousValues: true,
    });
    return instance as unknown as User & { full_name: string };
  }
}
