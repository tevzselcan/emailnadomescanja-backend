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
  private substitutionsForTheDay: SubstitutionsForTheDay[] = [
    {
      date: '29. 12. 2023',
      substitutions: [
        {
          teacher: 'Križan, Jerneja',
          absentTeacher: 'Ferenc, Aleksandra',
          hour: '0',
          class: 'K2A',
          classroom: 'BE06',
          subject: 'LAT',
          type: 'Nadomeščanje',
        },
        {
          teacher: 'Križan, Jerneja',
          absentTeacher: 'Lubej, Boštjan',
          hour: '0',
          class: 'R2A',
          classroom: 'BE04',
          subject: 'UPNv',
          type: 'Zaposlitev',
        },
        {
          teacher: 'Križan, Jerneja',
          absentTeacher: 'Ferenc, Aleksandra',
          hour: '1',
          class: 'K2A',
          classroom: 'A33',
          subject: 'LATp',
          type: 'Nadomeščanje',
        },
        {
          teacher: 'Resinovič, Boštjan',
          absentTeacher: 'Lubej, Boštjan',
          hour: '1',
          class: 'R2A',
          classroom: 'BE04',
          subject: 'UPNv',
          type: 'Zaposlitev',
        },
        {
          teacher: 'Božič, Sara',
          absentTeacher: 'Ferenc, Aleksandra',
          hour: '2',
          class: 'K2A',
          classroom: 'A33',
          subject: 'LATp',
          type: 'Nadomeščanje',
        },
        {
          teacher: 'Resinovič, Boštjan',
          absentTeacher: 'Lubej, Boštjan',
          hour: '2',
          class: 'R2A',
          classroom: 'BE04',
          subject: 'UPNv',
          type: 'Zaposlitev',
        },
        {
          teacher: 'Žveglič, Oskar',
          absentTeacher: 'Klovar, Sebastian',
          hour: '2',
          class: 'K1A',
          classroom: 'BE07',
          subject: 'KINv',
          type: 'Zaposlitev',
        },
        {
          teacher: 'Božič, Sara',
          absentTeacher: 'Ferenc, Aleksandra',
          hour: '3',
          class: 'K2A',
          classroom: 'A33',
          subject: 'LATp',
          type: 'Nadomeščanje',
        },
        {
          teacher: 'Žveglič, Oskar',
          absentTeacher: 'Klovar, Sebastian',
          hour: '3',
          class: 'K1A',
          classroom: 'BE07',
          subject: 'KINv',
          type: 'Zaposlitev',
        },
        {
          teacher: 'Božič, Sara',
          absentTeacher: 'Ferenc, Aleksandra',
          hour: '4',
          class: 'K2A',
          classroom: 'A33',
          subject: 'LATp',
          type: 'Nadomeščanje',
        },
        {
          teacher: 'Sirk, Tilen',
          absentTeacher: 'Lubej, Boštjan',
          hour: '4',
          class: 'R3B',
          classroom: 'BE09',
          subject: 'NPP',
          type: 'Nadomeščanje',
        },
        {
          teacher: 'Koren, Jaka',
          absentTeacher: 'Lubej, Boštjan',
          hour: '5',
          class: 'R4B',
          classroom: 'BE09',
          subject: 'NUP',
          type: 'Nadomeščanje',
        },
        {
          teacher: 'Drofenik, Irena',
          absentTeacher: '',
          hour: '6',
          class: 'K4A',
          classroom: 'E13',
          subject: '',
          type: 'Dod.zadolž.',
        },
        {
          teacher: 'Drofenik, Irena',
          absentTeacher: 'Drofenik, Irena',
          hour: '7',
          class: 'K4A',
          classroom: 'E03',
          subject: 'ANK',
          type: 'Premestitev',
        },
        {
          teacher: 'Omerzel, Martina',
          absentTeacher: 'Omerzel, Martina',
          hour: '7',
          class: 'R4A',
          classroom: 'E07',
          subject: 'MA4',
          type: 'Namesto 19. 10.',
        },
        {
          teacher: 'Omerzel, Martina',
          absentTeacher: '',
          hour: '8',
          class: 'R4A',
          classroom: 'E07',
          subject: '',
          type: 'Namesto 26. 10.',
        },
      ],
      classChanges: [
        {
          teacher: 'Križan, Jerneja',
          hour: '1',
          class: 'E2A',
          classroom: 'Neva',
          subject: 'GEO',
        },
        {
          teacher: 'Drofenik, Irena',
          hour: '3',
          class: 'K3A',
          classroom: 'E04',
          subject: 'FIK',
        },
        {
          teacher: 'Drofenik, Irena',
          hour: '4',
          class: 'K4A',
          classroom: 'E13',
          subject: 'KPR',
        },
        {
          teacher: 'Vrečko, Marko',
          hour: '5',
          class: 'E1A',
          classroom: 'E05',
          subject: 'MEL',
        },
      ],
    },
  ];

  async setSubstitutions() {
    this.substitutionsForTheDay = await getAllSubstitutions();
  }

  async getAllSubstitutions() {
    //await this.setSubstitutions();
    return this.substitutionsForTheDay;
  }

  async getSubstitutionsForTeacher(user: User): Promise<Substitution[]> {
    try {
      const teacherFullName = `${user.last_name}, ${user.first_name}`;

      const teacherSubstitutions: Substitution[] = [];
      this.substitutionsForTheDay.forEach((sub) => {
        sub.substitutions.forEach((substitution) => {
          if (substitution.teacher === teacherFullName) {
            teacherSubstitutions.push(substitution);
          }
        });
      });

      return teacherSubstitutions;
    } catch (error) {
      Logging.error(error);
      return [];
    }
  }

  async getClassChangesForTeacher(user: User): Promise<ClassChange[]> {
    try {
      const teacherFullName = `${user.last_name}, ${user.first_name}`;

      const teacherClassChange: ClassChange[] = [];
      this.substitutionsForTheDay.forEach((cc) => {
        cc.classChanges.forEach((classChange) => {
          if (classChange.teacher === teacherFullName) {
            teacherClassChange.push(classChange);
          }
        });
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
      const substitutions = await this.getSubstitutionsForTeacher(user);

      const classChanges = await this.getClassChangesForTeacher(user);
      if (substitutions.length != 0 || classChanges.length != 0) {
        const substitutionDate = this.substitutionsForTheDay[0].date;

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
