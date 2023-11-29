import { Injectable, Logger } from '@nestjs/common';
import { getAllSubstitutions } from 'library/Scraping';
import { SubstitutionsForTheDay } from './type/substititutionsForTheDay.type';
import { User } from 'entities/user.entity';
import { Substitution } from './type/substitution.type';
import Logging from 'library/Logging';
import { MailService } from 'modules/mail/mail.service';
import { PreparedSubstitions } from './type/preparedSubstitutions.type';
import { UsersService } from 'modules/users/users.service';
import { ClassChange } from './type/classChange.type';

@Injectable()
export class SubstitutionsService {
  constructor(
    private mailService: MailService,
    private userService: UsersService,
  ) {}
  private substitutionsForTheDay: SubstitutionsForTheDay[] = [];

  async setSubstitutions() {
    this.substitutionsForTheDay = await getAllSubstitutions();
  }

  async getAllSubstitutions() {
    await this.setSubstitutions();
    return this.substitutionsForTheDay;
  }

  async getSubstitutionsForTeacher(
    user: User,
    substitution: SubstitutionsForTheDay,
  ): Promise<Substitution[]> {
    try {
      const teacherFullName = `${user.last_name}, ${user.first_name}`;

      const teacherSubstitutions: Substitution[] = [];
      substitution.substitutions.forEach((substitution) => {
        if (substitution.teacher === teacherFullName) {
          teacherSubstitutions.push(substitution);
        }
      });

      return teacherSubstitutions;
    } catch (error) {
      Logging.error(error);
      return [];
    }
  }

  async getClassChangesForTeacher(
    user: User,
    substitution: SubstitutionsForTheDay,
  ): Promise<ClassChange[]> {
    try {
      const teacherFullName = `${user.last_name}, ${user.first_name}`;

      const teacherClassChange: ClassChange[] = [];
      substitution.classChanges.forEach((classChange) => {
        if (classChange.teacher === teacherFullName) {
          teacherClassChange.push(classChange);
        }
      });

      return teacherClassChange;
    } catch (error) {
      Logging.error(error);
      return [];
    }
  }

  async prepareTeacherSubstititutions(): Promise<PreparedSubstitions[]> {
    const users: User[] = await this.userService.findAll();
    const preparedSubstitutions: PreparedSubstitions[] = [];

    for (const user of users) {
      for (const substitution of this.substitutionsForTheDay) {
        const substitutions = await this.getSubstitutionsForTeacher(
          user,
          substitution,
        );
        const classChanges = await this.getClassChangesForTeacher(
          user,
          substitution,
        );
        if (substitutions.length !== 0 || classChanges.length !== 0) {
          const substitutionDate = substitution.date;
          const isOlder = await this.isInputOlder(substitutionDate);
          if (!isOlder) {
            const preparedSubstitution: PreparedSubstitions = {
              date: substitutionDate,
              email: user.email,
              unsubscribeLink: `${process.env.UNSUBSCRIBE_URL}/users/unsubscribe/${user.id}`,
              substitutions,
              classChanges,
            };

            preparedSubstitutions.push(preparedSubstitution);
          }
        }
      }
    }
    return preparedSubstitutions;
  }

  async isInputOlder(dateString: string): Promise<boolean> {
    const today = new Date();
    const [day, month, year] = dateString.split('.').map(Number);

    const inputDate = new Date(year, month - 1, day);

    return inputDate <= today;
  }

  async sendPreparedTeacherSubstitutions() {
    const subs = await this.prepareTeacherSubstititutions();
    await this.mailService.sendSubstitutionEmails(subs);
    return subs;
  }
}
