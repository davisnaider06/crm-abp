import { Injectable } from '@nestjs/common';
import { LeadSource, NegotiationStatus, User } from '@prisma/client';
import { AccessScopeService } from '../common/access-scope.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly accessScopeService: AccessScopeService,
  ) {}

  async getDashboard(user: User) {
    const leadWhere = this.accessScopeService.leadWhere(user);
    const negotiationWhere = this.accessScopeService.negotiationWhere(user);

    const [totalLeads, openDeals, totalCustomers, converted, leads] =
      await Promise.all([
        this.prismaService.lead.count({ where: leadWhere }),
        this.prismaService.negotiation.count({
          where: {
            ...negotiationWhere,
            isActive: true,
          },
        }),
        this.prismaService.customer.count({
          where: this.accessScopeService.customerWhere(user),
        }),
        this.prismaService.lead.count({
          where: {
            ...leadWhere,
            status: 'WON',
          },
        }),
        this.prismaService.lead.findMany({
          where: leadWhere,
          include: {
            customer: true,
            attendant: true,
            negotiations: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

    const stats = [
      { title: 'Total leads', value: String(totalLeads), trend: '+8%', accent: 'purple' },
      { title: 'Open deals', value: String(openDeals), trend: '-2%', accent: 'coral' },
      { title: 'New customers', value: String(totalCustomers), trend: '+12%', accent: 'violet' },
      { title: 'Converted', value: String(converted), trend: '+10%', accent: 'purple' },
    ];

    const sourceCounts = Object.values(LeadSource).reduce<Record<string, number>>(
      (acc, source) => {
        acc[source] = 0;
        return acc;
      },
      {},
    );

    leads.forEach((lead) => {
      sourceCounts[lead.source] += 1;
    });

    const applications = [
      {
        name: 'WhatsApp',
        value: sourceCounts.WHATSAPP,
        color: '#6f3ff5',
      },
      {
        name: 'Instagram',
        value: sourceCounts.INSTAGRAM,
        color: '#ffae43',
      },
      {
        name: 'Landing Page',
        value: sourceCounts.DIGITAL_FORM,
        color: '#ffe256',
      },
    ];

    const leadsByMonth = Array.from({ length: 12 }, (_, index) => {
      const month = new Date(2026, index, 1).toLocaleString('en-US', {
        month: 'short',
      });
      return { month, value: 0 };
    });

    leads.forEach((lead) => {
      const monthIndex = new Date(lead.createdAt).getMonth();
      if (leadsByMonth[monthIndex]) {
        leadsByMonth[monthIndex].value += 1;
      }
    });

    const turnoverData = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return {
        label: date.toLocaleString('en-US', { month: 'short' }),
        value: 0,
      };
    });

    const openStatuses = new Set<NegotiationStatus>(['OPEN']);
    leads.forEach((lead) => {
      const currentNegotiation = lead.negotiations.find((item) => item.isActive);
      if (!currentNegotiation || !openStatuses.has(currentNegotiation.status)) {
        return;
      }
      const monthKey = new Date(currentNegotiation.createdAt).toLocaleString('en-US', {
        month: 'short',
      });
      const bucket = turnoverData.find((item) => item.label === monthKey);
      if (bucket) {
        bucket.value += 1;
      }
    });

    const interviewList = leads.slice(0, 3).map((lead) => ({
      name: lead.customer.name,
      department: lead.attendant.name,
      date: lead.createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }));

    const calendarItems = leads.slice(0, 6).map((lead, index) => ({
      hour: `${10 + index} ${index < 2 ? 'am' : 'pm'}`,
      title: lead.title,
      subtitle: lead.customer.name,
    }));

    return {
      stats,
      applications,
      leadsByMonth,
      turnoverData,
      interviewList,
      calendarItems,
    };
  }

  async getLeads(user: User) {
    const rows = await this.prismaService.lead.findMany({
      where: this.accessScopeService.leadWhere(user),
      include: {
        customer: true,
        store: true,
        attendant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      overview: {
        active: rows.length,
        responseRate: `${Math.max(15, Math.min(98, rows.length * 7))}%`,
        firstReply: `${Math.max(5, 20 - Math.min(rows.length, 12))}m`,
      },
      chart: this.groupLeadsByMonth(rows),
      rows: rows.map((row) => ({
        id: row.id,
        name: row.customer.name,
        origin: this.formatSource(row.source),
        store: row.store.city,
        status: this.formatLabel(row.status),
        tone:
          row.importance === 'HOT'
            ? 'violet'
            : row.importance === 'WARM'
              ? 'gold'
              : 'slate',
        owner: row.attendant.name,
      })),
    };
  }

  async getCustomers(user: User) {
    const rows = await this.prismaService.customer.findMany({
      where: this.accessScopeService.customerWhere(user),
      include: {
        leads: {
          include: {
            store: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      segments: [
        { value: rows.filter((item) => item.leads.length >= 2).length, label: 'VIP customers', tone: 'default' },
        { value: rows.filter((item) => item.leads.length === 1).length, label: 'Returning buyers', tone: 'warm' },
        { value: rows.filter((item) => item.leads.length === 0).length, label: 'Ready for upgrade', tone: 'yellow' },
      ],
      rows: rows.map((row) => ({
        id: row.id,
        name: row.name,
        city: row.leads[0]?.store.city ?? 'No store',
        stage: row.leads.length >= 2 ? 'VIP' : row.leads.length === 1 ? 'Returning' : 'Prospect',
        lastDeal: row.leads[0]?.title ?? 'No vehicle',
        contact: row.updatedAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      })),
    };
  }

  async getNegotiations(user: User) {
    const rows = await this.prismaService.negotiation.findMany({
      where: this.accessScopeService.negotiationWhere(user),
      include: {
        lead: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const chartBuckets = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return {
        label: date.toLocaleString('en-US', { month: 'short' }),
        value: 0,
      };
    });

    rows.forEach((row) => {
      const label = row.createdAt.toLocaleString('en-US', { month: 'short' });
      const bucket = chartBuckets.find((item) => item.label === label);
      if (bucket) {
        bucket.value += 1;
      }
    });

    return {
      chart: chartBuckets,
      pipelineValue: `R$ ${rows.length * 135}k`,
      rows: rows.map((row) => ({
        id: row.id,
        lead: row.lead.customer.name,
        vehicle: row.lead.title,
        stage: this.formatLabel(row.stage),
        amount: `R$ ${(120000 + rows.indexOf(row) * 8200).toLocaleString('pt-BR')}`,
        probability:
          row.status === 'WON'
            ? 100
            : row.status === 'OPEN'
              ? 72
              : 45,
      })),
    };
  }

  private groupLeadsByMonth(
    rows: Array<{
      createdAt: Date;
    }>,
  ) {
    const buckets = Array.from({ length: 12 }, (_, index) => ({
      month: new Date(2026, index, 1).toLocaleString('en-US', { month: 'short' }),
      value: 0,
    }));

    rows.forEach((row) => {
      const monthIndex = new Date(row.createdAt).getMonth();
      if (buckets[monthIndex]) {
        buckets[monthIndex].value += 1;
      }
    });

    return buckets;
  }

  private formatSource(source: LeadSource) {
    return source
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private formatLabel(value: string) {
    return value
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
