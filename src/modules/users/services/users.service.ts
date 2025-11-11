import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AppLogger } from 'src/common/services/logger.service';
import type { UserModel as User } from '../../../../generated/prisma/models/User';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${dto.firstName}`);
    try {
      const payload = {
        first_name: dto.firstName,
        last_name: dto.lastName ?? null,
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const user = await this.prisma.raw.user.create({ data: payload });
      return user as User;
    } catch (err) {
      this.logger.error(
        'Failed to create user',
        String((err as Error)?.message ?? err),
      );
      throw err;
    }
  }

  async findAll(): Promise<User[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return (await this.prisma.raw.user.findMany()) as User[];
  }

  async findById(id: number): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const user = await this.prisma.raw.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user as User;
  }
}
