import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Progress } from '@prisma/client';

@Injectable()
export class ProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdateProgress(
    titulo: string,
    completo: number,
  ): Promise<Progress> {
    const existing = await this.prisma.progress.findFirst({
      where: { titulo },
    });

    if (existing) {
      return this.prisma.progress.update({
        where: { id: existing.id }, // Agora usamos o ID correto
        data: { completo },
      });
    }

    return this.prisma.progress.create({
      data: { titulo, completo },
    });
  }

  async getAllProgress(): Promise<Progress[]> {
    return this.prisma.progress.findMany();
  }

  async getProgressByTitle(titulo: string): Promise<Progress | null> {
    return this.prisma.progress.findFirst({ where: { titulo } });
  }

  async hasAnyData(): Promise<boolean> {
    const count = await this.prisma.progress.count();
    return count > 0;
  }
}
