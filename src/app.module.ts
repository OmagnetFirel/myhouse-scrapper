import { Module } from '@nestjs/common';
import { ScraperModule } from './modules/scraper/module/scraper.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScraperModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
