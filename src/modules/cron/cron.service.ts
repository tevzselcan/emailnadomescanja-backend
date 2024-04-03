import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import Logging from 'library/Logging';
import { SubstitutionsService } from 'modules/substitutions/substitutions.service';

@Injectable()
export class CronService {
  constructor(private substitsionService: SubstitutionsService) {}
  @Cron('0 20 * * 0-4')
  async sendSubtitutionsMail() {
    try {
      await this.substitsionService.setSubstitutions();
      await this.substitsionService.sendPreparedTeacherSubstitutions();
    } catch (error) {
      Logging.error('Error while executing cron job');
    }
  }
}
