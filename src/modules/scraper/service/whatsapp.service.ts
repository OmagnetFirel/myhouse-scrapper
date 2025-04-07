import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly whatsappApiUrl = 'https://graph.facebook.com/v18.0';
  private readonly accessToken: string;
  private readonly phoneNumberId: string;
  private readonly recipientNumbers: string;

  constructor(private configService: ConfigService) {
    this.accessToken =
      this.configService.get<string>('WHATSAPP_ACCESS_TOKEN') ?? '';

    if (!this.accessToken) {
      throw new Error(
        'WHATSAPP_ACCESS_TOKEN is not defined in environment variables',
      );
    }

    this.phoneNumberId =
      this.configService.get<string>('WHATSAPP_PHONE_ID') ?? '';
    if (!this.phoneNumberId) {
      throw new Error(
        'WHATSAPP_PHONE_ID is not defined in environment variables',
      );
    }

    this.recipientNumbers =
      this.configService.get<string>('RECIPIENT_PHONE_NUMBERS') ?? '';
    if (!this.recipientNumbers) {
      throw new Error(
        'RECIPIENT_PHONE_NUMBERS is not defined in environment variables',
      );
    }
  }

  async sendMessage(message: string) {
    const recipientNumbers = this.recipientNumbers.split(',');
    for (const recipientNumber of recipientNumbers) {
      await this.sendWhatsAppMessage(recipientNumber.trim(), message);
    }
  }

  async sendWhatsAppMessage(recipientNumber: string, message: string) {
    try {
      const url = `${this.whatsappApiUrl}/${this.phoneNumberId}/messages`;
      const payload = {
        messaging_product: 'whatsapp',
        to: recipientNumber,
        type: 'text',
        text: { body: message },
      };

      const headers = {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(url, payload, { headers });
      this.logger.log(
        'Mensagem enviada com sucesso:',
        JSON.stringify(response.data, null, 2),
      );
    } catch (error) {
      this.logger.error('Erro ao enviar mensagem no WhatsApp', error);
    }
  }
}
