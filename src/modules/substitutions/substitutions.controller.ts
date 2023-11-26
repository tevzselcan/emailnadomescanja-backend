import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Get,
  Delete,
} from '@nestjs/common';
import { SubstitutionsService } from './substitutions.service';
import { SubstitutionsForTheDay } from './type/substititutionsForTheDay.type';
import { User } from 'entities/user.entity';
import { Substitution } from './type/substitution.type';
import { PreparedSubstitions } from './type/preparedSubstitutions.type';

@Controller('substitutions')
export class SubstitutionsController {
  constructor(private readonly substitutionsService: SubstitutionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async test(): Promise<SubstitutionsForTheDay[]> {
    return this.substitutionsService.getAllSubstitutions();
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async getSubsForTeacher() {
    //return await this.substitutionsService.sendPreparedTeacherSubstitutions();
    return await this.substitutionsService.getAllSubstitutions();
  }
}
