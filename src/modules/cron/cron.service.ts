import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import Logging from 'library/Logging';
import { MailService } from 'modules/mail/mail.service';
import { SubstitutionsService } from 'modules/substitutions/substitutions.service';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class CronService {
  constructor(private substitsionService: SubstitutionsService) {}
  @Cron('45 * * * * *')
  async sendSubtitutionsMail() {
    try {
      await this.substitsionService.setSubstitutions();
      await this.substitsionService.sendPreparedTeacherSubstitutions();
    } catch (error) {
      Logging.error('Error while executing cron job');
    }
  }
}
