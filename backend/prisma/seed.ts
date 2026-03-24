import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existingTeam = await prisma.team.findFirst({
    where: { name: 'Equipe Premium' },
  });

  const team =
    existingTeam ??
    (await prisma.team.create({
      data: {
        name: 'Equipe Premium',
      },
    }));

  const store = await prisma.store.upsert({
    where: { id: 'seed-store-jacarei' },
    update: {},
    create: {
      id: 'seed-store-jacarei',
      name: '1000 Valle Jacarei',
      city: 'Jacarei',
      state: 'SP',
    },
  });

  const passwordHash = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@crm.local' },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
      name: 'Admin CRM',
    },
    create: {
      name: 'Admin CRM',
      email: 'admin@crm.local',
      passwordHash,
      role: UserRole.ADMIN,
      teamId: team.id,
    },
  });

  await prisma.operationLog.create({
    data: {
      action: 'CREATE',
      entity: 'seed',
      description: `Seed executed for ${store.name}`,
      userId: admin.id,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
