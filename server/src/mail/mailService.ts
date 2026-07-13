import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Base62 Admin" <${process.env.SMTP_USER}>`,
        to: to,
        subject: 'Your One-Time Password (OTP)',
        html: `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
      });

      this.logger.log(`Message sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw error;
    }
  }
}
