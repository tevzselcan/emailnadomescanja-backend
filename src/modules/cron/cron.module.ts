import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { UsersModule } from 'modules/users/users.module';
import { MailModule } from 'modules/mail/mail.module';
import { SubstitutionsModule } from 'modules/substitutions/substitutions.module';

@Module({
  providers: [CronService],
  exports: [CronService],
  imports: [SubstitutionsModule],
})
export class CronModule {}
