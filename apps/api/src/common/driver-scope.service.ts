import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriverScopeService {
  constructor(private readonly prisma: PrismaService) {}

  async findDriverForUser(user: JwtPayload) {
    return this.prisma.driver.findFirst({
      where: {
        organizationId: user.organizationId,
        userId: user.sub,
      },
    });
  }

  async requireDriverForUser(user: JwtPayload) {
    if (user.role !== UserRole.DRIVER) {
      throw new ForbiddenException('Kun for sjåfører');
    }
    const driver = await this.findDriverForUser(user);
    if (!driver) {
      throw new BadRequestException(
        'Brukeren er ikke koblet til en sjåførprofil',
      );
    }
    return driver;
  }
}
