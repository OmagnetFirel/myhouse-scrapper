import { Module } from '@nestjs/common';
import { WhatsappService } from '../service/whatsapp.service';

@Module({
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
