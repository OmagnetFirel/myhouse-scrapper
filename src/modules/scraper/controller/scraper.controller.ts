import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ScraperService, Progress } from '../service/scraper.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  @ApiQuery({ name: 'url', required: true, description: 'URL to scrape' })
  async getScrapedData(
    @Query('url') url: string,
  ): Promise<string | Progress[]> {
    if (!url) {
      throw new BadRequestException('URL é obrigatória'); // Lança erro corretamente
    }
    return this.scraperService.scrape(url);
  }
}
