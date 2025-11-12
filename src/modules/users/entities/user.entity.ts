import { Exclude, Expose } from 'class-transformer';
import type { User } from 'generated/prisma/client';

export class UserEntity implements Partial<User> {
  @Expose()
  id: number;

  @Expose()
  first_name: string;

  @Expose()
  last_name?: string | null;

  @Exclude()
  password?: string | null;

  @Expose()
  get full_name(): string {
    // gabungkan tanpa newline / spasi berlebih
    return [this.first_name, this.last_name].filter(Boolean).join(' ');
  }
}
