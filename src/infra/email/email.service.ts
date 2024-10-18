import { Injectable } from '@nestjs/common';
import { ResendService } from '../resend/resend.service';
import { confirmationCodeTemplate } from './templates/confirmation-code';
import { customEmailTemplate } from './templates/custom-email';

@Injectable()
export class EmailService {
  constructor(private readonly resendService: ResendService) {}

  async sendConfirmationCodeEmail(
    user: { name: string; email: string },
    confirmationCode: string,
  ) {
    const sentEmail = await this.resendService.sendEmail({
      to: [user.email],
      subject: 'Hey! Here is your confirmation code',
      html: confirmationCodeTemplate({ name: user.name, confirmationCode }),
    });

    return sentEmail;
  }

  async sendCustomEmail(email: {
    subject: string;
    body: string;
    to: string;
    fileBase64?: string;
    fileName?: string;
  }) {
    const sentEmail = await this.resendService.sendEmail({
      to: [email.to],
      subject: email.subject,
      html: email.body,
      attachments: email.fileBase64
        ? [
            {
              content: email.fileBase64,
              filename: email.fileName ?? '',
              path: '',
            },
          ]
        : undefined,
    });

    return sentEmail;
  }
}
