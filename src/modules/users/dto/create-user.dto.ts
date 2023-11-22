import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
  first_name?: string;

  last_name?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
