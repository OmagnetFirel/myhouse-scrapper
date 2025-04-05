import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../../../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { WhatsappService } from './whatsapp.service';
import { ConfigService } from '@nestjs/config';

export interface Progress {
  titulo: string;
  completo: number;
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly url: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsappService,
    private configService: ConfigService,
  ) {
    this.url = this.configService.get<string>('WEBSITE_URL') ?? '';

    if (!this.url) {
      throw new Error('WEBSITE_URL is not defined in environment variables');
    }
  }

  async scrape(url: string) {
    this.logger.log(`Iniciando scrape na URL: ${url}`);
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const results: Progress[] = [];

      $('.elementor-widget-progress').each((_, element) => {
        const titulo = $(element).find('.elementor-title').text().trim();
        const completo = parseFloat(
          $(element).find('.elementor-progress-bar').attr('data-max') || '0',
        );

        results.push({ titulo, completo });
      });

      await this.processUpdates(results);
      return results;
    } catch (error) {
      this.logger.error(`Erro ao fazer scrape: ${error}`);
      return `Não foi possivel realizar o scrape no momento, tente mais tarde. ${error}`;
    }
  }

  async processUpdates(progressData: { titulo: string; completo: number }[]) {
    const updates: string[] = [];
    this.logger.log('Processando atualizações...');
    for (const { titulo, completo } of progressData) {
      const existingProgress = await this.prisma.progress.findUnique({
        where: { titulo },
      });

      if (!existingProgress || existingProgress.completo < completo) {
        await this.prisma.progress.upsert({
          where: { titulo },
          update: { completo },
          create: { titulo, completo },
        });

        if (existingProgress) {
          const diff = completo - existingProgress.completo;
          updates.push(
            `🔹 ${titulo} avançou ${diff}% e agora está em ${completo}%.`,
          );
        }
      }
    }

    if (updates.length > 0) {
      const message = `🚧 Atualizações na obra:\n\n${updates.join('\n')}`;
      await this.whatsappService.sendMessage(message);
    }

    if (updates.length === 0) {
      this.logger.log('Nenhuma atualização encontrada.');
      await this.whatsappService.sendMessage(
        '🚧 Obra sem nenhuma atualização 🚧🤡🤡🤡🤡☠️☠️☠️',
      );
    }
  }

  @Cron('0 10 */5 * *')
  async handleCron() {
    this.logger.log(`Iniciando scrape programado na URL: ${this.url}`);
    await this.scrape(this.url);
  }
}
