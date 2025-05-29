import { IsString } from 'class-validator';
// This file is part of the NestJS server for the Open Source project.
export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
