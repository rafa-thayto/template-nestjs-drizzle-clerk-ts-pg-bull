import { Resend } from 'resend';

type Attachment = {
  content: string;
  path: string;
  filename: string;
};

type SendEmailParams = {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Attachment[];
};

export class ResendService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail({ from, to, subject, html, attachments }: SendEmailParams) {
    try {
      const data = await this.resend.emails.send({
        from: from || 'ChangeName <noreply@changename.com>',
        to,
        subject,
        html,
        attachments,
      });

      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
