import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Delete,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('unsubscribe/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<string> {
    try {
      await this.usersService.remove(id);
      return '<html><body><h1>You have successfully unsubscribed.</h1></body></html>';
    } catch (error) {
      return '<html><body><h1>There was an error while unsubscribing. Please try again later.</h1></body></html>';
    }
  }
}
