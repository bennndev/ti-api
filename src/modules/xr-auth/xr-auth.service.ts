import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { XrAuthRepository } from './xr-auth.repository';
import { ValidatePinDto } from './dto';
import { PrismaService } from '@/lib/prisma';
import { SignJWT } from 'jose';

@Injectable()
export class XrAuthService {
  private readonly logger = new Logger(XrAuthService.name);
  private readonly PIN_EXPIRY_MINUTES = 5;

  constructor(
    private readonly xrAuthRepository: XrAuthRepository,
    private readonly prisma: PrismaService,
  ) {}

  private createRandomPin(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generatePin(userId: string): Promise<string> {
    const pin = this.createRandomPin();
    const expiresAt = new Date(Date.now() + this.PIN_EXPIRY_MINUTES * 60 * 1000);

    await this.xrAuthRepository.createUnchecked({
      userId,
      pin,
      expiresAt,
    });

    this.logger.log(`PIN generated for user ${userId}, expires at ${expiresAt}`);
    return pin;
  }

  async validatePinAndGetToken(dto: ValidatePinDto): Promise<{ token: string; expiresAt: Date; user: { id: string; email: string; name: string | null; orgId: number | null; roleId: number | null } }> {
    // Find any valid PIN matching (userId from PIN record, not provided externally)
    const pinRecord = await this.xrAuthRepository.findValidPin(
      dto.pin,
    );

    if (!pinRecord) {
      this.logger.warn(`Invalid or expired PIN attempted`);
      throw new UnauthorizedException('Invalid or expired PIN');
    }

    // Mark PIN as used
    await this.xrAuthRepository.markAsUsed(pinRecord.id);

    // Get user from DB
    const user = await this.prisma.user.findUnique({
      where: { id: pinRecord.userId },
      select: {
        id: true,
        email: true,
        name: true,
        orgId: true,
        roleId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate JWT for XR
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'xr-secret-key');

    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      orgId: user.orgId,
      roleId: user.roleId,
      type: 'xr',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(expiresAt)
      .setIssuedAt()
      .sign(secret);

    return {
      token,
      expiresAt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        orgId: user.orgId,
        roleId: user.roleId,
      },
    };
  }
}