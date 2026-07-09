import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resendApiKey = process.env.RESEND_API_KEY as string;
  private readonly resendApiUrl = process.env.RESEND_API_URL as string;

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    try {
      const response = await fetch(this.resendApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.resendApiKey}`
        },
        body: JSON.stringify({
          from: 'Base62 Admin <onboarding@resend.dev>',
          to: [to],
          subject: 'Your One-Time Password (OTP)',
          html: `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Resend API Error: ${errorData}`);
      }

      const data = await response.json();
      this.logger.log(`Message sent via Resend: ${data.id}`);
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw error;
    }
  }
}
