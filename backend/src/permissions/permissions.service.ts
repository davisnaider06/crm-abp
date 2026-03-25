import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async listPermissions() {
    return this.prisma.permission.findMany();
  }

  async createPermission(data: { key: string; resource: string; action: string; description?: string }) {
    return this.prisma.permission.create({ data });
  }

  async findPermissionByKey(key: string) {
    return this.prisma.permission.findUnique({ where: { key } });
  }

  async listUserPermissions(userId: string) {
    return this.prisma.userPermission.findMany({ where: { userId }, include: { permission: true } });
  }

  async assignPermissionToUser(userId: string, permissionKey: string) {
    const permission = await this.findPermissionByKey(permissionKey);
    if (!permission) throw new NotFoundException('Permission not found');

    return this.prisma.userPermission.upsert({
      where: { userId_permissionId: { userId, permissionId: permission.id } },
      update: {},
      create: { userId, permissionId: permission.id },
    });
  }

  async revokePermissionFromUser(userId: string, permissionKey: string) {
    const permission = await this.findPermissionByKey(permissionKey);
    if (!permission) throw new NotFoundException('Permission not found');

    return this.prisma.userPermission.deleteMany({ where: { userId, permissionId: permission.id } });
  }
}
