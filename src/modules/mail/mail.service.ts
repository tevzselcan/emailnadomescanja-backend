import { Injectable } from '@nestjs/common';
import Logging from 'library/Logging';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendSubstitutionEmails(substitutionsData: any[]): Promise<void> {
    for (const entry of substitutionsData) {
      const { email, date, unsubscribeLink, substitutions, classChanges } =
        entry;
      const emailHTML = this.generateHTMLFromTemplate({
        date,
        unsubscribeLink,
        substitutions,
        classChanges,
      });

      await this.sendMail(email, 'Nadomeščanja', emailHTML);
    }
  }

  async sendMail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent,
      });
      Logging.info(`Email sent to ${to} successfully!`);
    } catch (error) {
      Logging.error(`Error sending email to ${to}: ${error}`);
    }
  }

  private generateHTMLFromTemplate(replacements: any): string {
    try {
      const template = fs.readFileSync(
        'src/modules/mail/templates/substitutionsEmail.hbs',
        'utf-8',
      );
      const compiledTemplate = Handlebars.compile(template);
      return compiledTemplate(replacements);
    } catch (error) {
      Logging.error(`Error generating HTML from template: ${error}`);
      throw new Error('Failed to generate HTML from template');
    }
  }
}
