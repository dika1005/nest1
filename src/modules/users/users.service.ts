import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AppLogger } from 'src/common/services/logger.service';
import type { UserModel as User } from '../../../generated/prisma/models/User';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${dto.firstName}`);
    try {
      const lastName = dto.lastName ?? null;
      const user = await (
        this.prisma as unknown as {
          user: {
            create(args: any): Promise<User>;
            findMany(args?: any): Promise<User[]>;
            findUnique(args: any): Promise<User | null>;
          };
        }
      ).user.create({
        data: {
          first_name: dto.firstName,
          last_name: lastName,
        },
      });
      return user;
    } catch (err) {
      this.logger.error(
        'Failed to create user',
        String((err as Error)?.message ?? err),
      );
      throw err;
    }
  }
  async findAll(): Promise<User[]> {
    return await (
      this.prisma as unknown as {
        user: {
          create(args: any): Promise<User>;
          findMany(args?: any): Promise<User[]>;
          findUnique(args: any): Promise<User | null>;
        };
      }
    ).user.findMany();
  }

  async findById(id: number): Promise<User> {
    const user = await (
      this.prisma as unknown as {
        user: {
          create(args: any): Promise<User>;
          findMany(args?: any): Promise<User[]>;
          findUnique(args: any): Promise<User | null>;
        };
      }
    ).user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
