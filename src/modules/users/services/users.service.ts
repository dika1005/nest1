import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AppLogger } from 'src/common/services/logger.service';
import type { UserModel as User } from '../../../../generated/prisma/models/User';
import { UpdateUserDto } from '../dto/update-user.dto';

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
      const user = await this.prisma.raw.user.create({ data: payload });
      return user as User;
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error('Failed to create user', err.message);
        throw new InternalServerErrorException(err.message);
      }
      this.logger.error('Failed to create user', String(err));
      throw new InternalServerErrorException(
        'Unknown error while creating user',
      );
    }
  }

  async findAll(): Promise<User[]> {
    return (await this.prisma.raw.user.findMany()) as User[];
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.raw.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user as User;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    // findById already throws if not found, so this check is optional
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    const data: { first_name?: string; last_name?: string | null } = {};
    if (dto.firstName !== undefined) data.first_name = dto.firstName;
    if (dto.lastName !== undefined) data.last_name = dto.lastName ?? null;

    try {
      const updatedUser = await this.prisma.raw.user.update({
        where: { id },
        data,
      });
      return updatedUser as User;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Unknown error while updating user',
      );
    }
  }
}
