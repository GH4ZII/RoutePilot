import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoutesService } from './routes.service';

@Injectable()
export class RouteSummaryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
    private readonly routes: RoutesService,
    private readonly config: ConfigService,
  ) {}

  async getSummary(user: JwtPayload, routeId: string) {
    const existing = await this.prisma.routeSummary.findFirst({
      where: {
        routeId,
        route: this.orgScope.forOrganization(user),
      },
    });
    if (existing) {
      return {
        routeId,
        summary: existing.summary,
        model: existing.model,
        generatedAt: existing.generatedAt,
      };
    }
    return this.generateSummary(user, routeId);
  }

  async generateSummary(user: JwtPayload, routeId: string) {
    const route = await this.routes.findOne(user, routeId);
    const apiKey = this.config.get<string>('OPENAI_API_KEY')?.trim();

    let summary: string;
    let model: string | null = null;

    if (apiKey) {
      const ai = await this.callOpenAi(route, apiKey);
      summary = ai.summary;
      model = ai.model;
    } else {
      summary = this.buildTemplateSummary(route);
      model = 'template';
    }

    const saved = await this.prisma.routeSummary.upsert({
      where: { routeId },
      create: {
        routeId,
        summary,
        model,
      },
      update: {
        summary,
        model,
        generatedAt: new Date(),
      },
    });

    return {
      routeId,
      summary: saved.summary,
      model: saved.model,
      generatedAt: saved.generatedAt,
    };
  }

  private buildTemplateSummary(route: Awaited<ReturnType<RoutesService['findOne']>>): string {
    const completed = route.stops.filter((s) => s.status === 'COMPLETED').length;
    const failed = route.stops.filter((s) => s.status === 'FAILED').length;
    const pending = route.stops.filter((s) => s.status === 'PENDING').length;
    const driver = route.driver?.name ?? 'Ikke tildelt';
    const distance =
      route.totalDistanceMeters != null
        ? `${(route.totalDistanceMeters / 1000).toFixed(1)} km`
        : 'ukjent distanse';

    return [
      `Rutesammendrag for ${driver} (${route.status}).`,
      `Planlagt distanse: ${distance}, ${route.stops.length} stopp totalt.`,
      `${completed} levert, ${failed} feilet, ${pending} gjenstår.`,
      route.startedAt
        ? `Startet ${route.startedAt.toISOString()}`
        : 'Ruten er ikke startet ennå.',
    ].join(' ');
  }

  private async callOpenAi(
    route: Awaited<ReturnType<RoutesService['findOne']>>,
    apiKey: string,
  ): Promise<{ summary: string; model: string }> {
    const model = 'gpt-4o-mini';
    const prompt = `Skriv et kort norsk rutesammendrag (2-4 setninger) for en dispatcher basert på denne JSON-dataen:\n${JSON.stringify({
      status: route.status,
      driver: route.driver?.name,
      stops: route.stops.map((s) => ({
        order: s.stopOrder,
        customer: s.delivery.customerName,
        status: s.status,
        estimatedArrival: s.estimatedArrival,
        actualArrival: s.actualArrival,
      })),
      totalDistanceMeters: route.totalDistanceMeters,
    })}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Du er en logistikk-assistent. Svar kun med sammendragsteksten.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI HTTP ${response.status}`);
    }

    const body = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const summary =
      body.choices?.[0]?.message?.content?.trim() ??
      this.buildTemplateSummary(route);

    return { summary, model };
  }
}
