import { IsEmail, IsOptional, Matches, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  first_name?: string;

  @IsOptional()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
