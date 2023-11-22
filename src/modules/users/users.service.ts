import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { AbstractService } from 'modules/abstract/abstract.service';
import Logging from 'library/Logging';

@Injectable()
export class UsersService extends AbstractService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findBy({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('Profesor s tem emailom je že prijavljen!');
    }
    try {
      const newUser = this.userRepository.create({
        ...createUserDto,
      });
      return this.userRepository.save(newUser);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Prišlo je do napake med ustvarjanjem uporabnika.',
      );
    }
  }
}
