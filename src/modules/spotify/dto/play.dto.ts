import { IsString, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class PlayDto {
  @IsString()
  state: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  uris: string[];

  @IsOptional()
  @IsString()
  deviceId?: string;
}
