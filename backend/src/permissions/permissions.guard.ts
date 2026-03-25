import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { PERMISSION_KEY } from './permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!permission) return true;

    const req = context.switchToHttp().getRequest<{ user?: any }>();
    const user = req.user;
    if (!user) throw new ForbiddenException('User context not available');

    const userPerm = await this.prisma.userPermission.findFirst({
      where: {
        userId: user.id,
        permission: { key: permission },
      },
      include: { permission: true },
    });

    if (!userPerm) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
