import { Injectable } from '@nestjs/common';
import { customersMock, dashboardMock, leadsMock, negotiationsMock } from './mock-data';

@Injectable()
export class CrmService {
  getDashboard() {
    return dashboardMock;
  }

  getLeads() {
    return {
      overview: {
        active: 189,
        responseRate: '62%',
        firstReply: '14m',
      },
      chart: dashboardMock.leadsByMonth,
      rows: leadsMock,
    };
  }

  getCustomers() {
    return {
      segments: [
        { value: 74, label: 'VIP customers', tone: 'default' },
        { value: 46, label: 'Returning buyers', tone: 'warm' },
        { value: 31, label: 'Ready for upgrade', tone: 'yellow' },
      ],
      rows: customersMock,
    };
  }

  getNegotiations() {
    return {
      chart: dashboardMock.turnoverData,
      pipelineValue: 'R$ 602k',
      rows: negotiationsMock,
    };
  }
}
