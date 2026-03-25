import {
  LeadImportance,
  LeadSource,
  LeadStatus,
  NegotiationStage,
  NegotiationStatus,
  PrismaClient,
  type Lead,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertUser(input: {
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  teamId?: string;
}) {
  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      name: input.name,
      role: input.role,
      passwordHash: input.passwordHash,
      teamId: input.teamId,
    },
    create: input,
  });
}

async function upsertCustomer(input: {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}) {
  return prisma.customer.upsert({
    where: { cpf: input.cpf },
    update: input,
    create: input,
  });
}

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  const storeJacarei = await prisma.store.upsert({
    where: { id: 'seed-store-jacarei' },
    update: { name: '1000 Valle Jacarei', city: 'Jacarei', state: 'SP' },
    create: {
      id: 'seed-store-jacarei',
      name: '1000 Valle Jacarei',
      city: 'Jacarei',
      state: 'SP',
    },
  });

  const storeSj = await prisma.store.upsert({
    where: { id: 'seed-store-sj' },
    update: { name: '1000 Valle Sao Jose', city: 'Sao Jose', state: 'SP' },
    create: {
      id: 'seed-store-sj',
      name: '1000 Valle Sao Jose',
      city: 'Sao Jose',
      state: 'SP',
    },
  });

  const existingPremiumTeam = await prisma.team.findFirst({
    where: { name: 'Equipe Premium' },
  });
  const premiumTeam =
    existingPremiumTeam ??
    (await prisma.team.create({
      data: { name: 'Equipe Premium' },
    }));

  const existingDigitalTeam = await prisma.team.findFirst({
    where: { name: 'Equipe Digital' },
  });
  const digitalTeam =
    existingDigitalTeam ??
    (await prisma.team.create({
      data: { name: 'Equipe Digital' },
    }));

  const admin = await upsertUser({
    name: 'Admin CRM',
    email: 'admin@crm.local',
    passwordHash,
    role: UserRole.ADMIN,
    teamId: premiumTeam.id,
  });

  const generalManager = await upsertUser({
    name: 'Leonardo Robles',
    email: 'geral@crm.local',
    passwordHash,
    role: UserRole.GENERAL_MANAGER,
  });

  const managerPremium = await upsertUser({
    name: 'Ana Manager',
    email: 'manager@crm.local',
    passwordHash,
    role: UserRole.MANAGER,
    teamId: premiumTeam.id,
  });

  const managerDigital = await upsertUser({
    name: 'Bruno Manager',
    email: 'manager2@crm.local',
    passwordHash,
    role: UserRole.MANAGER,
    teamId: digitalTeam.id,
  });

  await prisma.team.update({
    where: { id: premiumTeam.id },
    data: { managerId: managerPremium.id },
  });
  await prisma.team.update({
    where: { id: digitalTeam.id },
    data: { managerId: managerDigital.id },
  });

  const attendantA = await upsertUser({
    name: 'Ana',
    email: 'ana@crm.local',
    passwordHash,
    role: UserRole.ATTENDANT,
    teamId: premiumTeam.id,
  });
  const attendantB = await upsertUser({
    name: 'Bruno',
    email: 'bruno@crm.local',
    passwordHash,
    role: UserRole.ATTENDANT,
    teamId: digitalTeam.id,
  });
  const attendantC = await upsertUser({
    name: 'Caio',
    email: 'caio@crm.local',
    passwordHash,
    role: UserRole.ATTENDANT,
    teamId: premiumTeam.id,
  });

  const marina = await upsertCustomer({
    name: 'Marina Costa',
    email: 'marina@email.com',
    phone: '12999990001',
    cpf: '11111111111',
  });
  const carlos = await upsertCustomer({
    name: 'Carlos Mendes',
    email: 'carlos@email.com',
    phone: '12999990002',
    cpf: '22222222222',
  });
  const leticia = await upsertCustomer({
    name: 'Leticia Souza',
    email: 'leticia@email.com',
    phone: '12999990003',
    cpf: '33333333333',
  });
  const rafael = await upsertCustomer({
    name: 'Rafael Lima',
    email: 'rafael@email.com',
    phone: '12999990004',
    cpf: '44444444444',
  });

  const leadsData = [
    {
      title: 'Corolla Cross',
      description: 'Cliente quer SUV automatico',
      source: LeadSource.WHATSAPP,
      status: LeadStatus.NEGOTIATION,
      importance: LeadImportance.HOT,
      customerId: marina.id,
      storeId: storeJacarei.id,
      attendantId: attendantA.id,
      teamId: premiumTeam.id,
      firstContactAt: new Date(),
    },
    {
      title: 'Compass Longitude',
      description: 'Interessado em troca com seminovo',
      source: LeadSource.INSTAGRAM,
      status: LeadStatus.QUALIFIED,
      importance: LeadImportance.WARM,
      customerId: carlos.id,
      storeId: storeSj.id,
      attendantId: attendantB.id,
      teamId: digitalTeam.id,
      firstContactAt: new Date(),
    },
    {
      title: 'Nivus Highline',
      description: 'Busca financiamento com entrada',
      source: LeadSource.STORE_VISIT,
      status: LeadStatus.CONTACTED,
      importance: LeadImportance.HOT,
      customerId: leticia.id,
      storeId: storeJacarei.id,
      attendantId: attendantC.id,
      teamId: premiumTeam.id,
      firstContactAt: new Date(),
    },
    {
      title: 'Creta Platinum',
      description: 'Lead novo vindo de telefone',
      source: LeadSource.PHONE,
      status: LeadStatus.NEW,
      importance: LeadImportance.COLD,
      customerId: rafael.id,
      storeId: storeSj.id,
      attendantId: attendantB.id,
      teamId: digitalTeam.id,
      firstContactAt: new Date(),
    },
  ];

  const leads: Lead[] = [];
  for (const leadData of leadsData) {
    const existingLead = await prisma.lead.findFirst({
      where: {
        title: leadData.title,
        customerId: leadData.customerId,
      },
    });

    const lead =
      existingLead ??
      (await prisma.lead.create({
        data: leadData,
      }));

    leads.push(lead);
  }

  const negotiationSeeds = [
    {
      leadId: leads[0].id,
      stage: NegotiationStage.PROPOSAL,
      status: NegotiationStatus.OPEN,
    },
    {
      leadId: leads[1].id,
      stage: NegotiationStage.DOCUMENTATION,
      status: NegotiationStatus.OPEN,
    },
    {
      leadId: leads[2].id,
      stage: NegotiationStage.CLOSING,
      status: NegotiationStatus.WON,
    },
  ];

  for (const item of negotiationSeeds) {
    const existingNegotiation = await prisma.negotiation.findFirst({
      where: {
        leadId: item.leadId,
      },
    });

    const negotiation =
      existingNegotiation ??
      (await prisma.negotiation.create({
        data: {
          leadId: item.leadId,
          stage: item.stage,
          status: item.status,
          isActive: item.status === NegotiationStatus.OPEN,
          closedAt: item.status === NegotiationStatus.OPEN ? null : new Date(),
        },
      }));

    const stageHistory = await prisma.negotiationStageHistory.findFirst({
      where: { leadId: item.leadId, toStage: item.stage },
    });
    if (!stageHistory) {
      await prisma.negotiationStageHistory.create({
        data: {
          leadId: item.leadId,
          toStage: negotiation.stage,
        },
      });
    }

    const statusHistory = await prisma.negotiationStatusHistory.findFirst({
      where: { leadId: item.leadId, toStatus: item.status },
    });
    if (!statusHistory) {
      await prisma.negotiationStatusHistory.create({
        data: {
          leadId: item.leadId,
          toStatus: negotiation.status,
        },
      });
    }
  }

  await prisma.operationLog.create({
    data: {
      action: 'CREATE',
      entity: 'seed',
      description: `Seed executed with users ${admin.email} and ${generalManager.email}`,
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
