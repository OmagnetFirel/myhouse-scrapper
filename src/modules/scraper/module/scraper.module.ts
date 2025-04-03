import { Module } from '@nestjs/common';
import { ScraperController } from '../controller/scraper.controller';
import { ScraperService } from '../service/scraper.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { WhatsappModule } from './whatsapp.module';

@Module({
  imports: [WhatsappModule],
  providers: [ScraperService, PrismaService],
  controllers: [ScraperController],
  exports: [ScraperService],
})
export class ScraperModule {}
