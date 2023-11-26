import { Module } from '@nestjs/common';
import { SubstitutionsService } from './substitutions.service';
import { SubstitutionsController } from './substitutions.controller';
import { MailModule } from 'modules/mail/mail.module';
import { UsersModule } from 'modules/users/users.module';

@Module({
  controllers: [SubstitutionsController],
  providers: [SubstitutionsService],
  imports: [MailModule, UsersModule],
  exports: [SubstitutionsService],
})
export class SubstitutionsModule {}
