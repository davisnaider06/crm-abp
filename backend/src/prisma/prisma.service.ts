import { INestApplication, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  private retryCount = 0;
  private readonly maxRetries = 5;
  private readonly retryDelay = 2000; // 2 seconds

  async onModuleInit() {
    await this.connectWithRetry();
  }

  private async connectWithRetry(): Promise<void> {
    try {
      this.logger.log('Attempting to connect to database...');
      await this.$connect();
      this.logger.log('Successfully connected to database');
      this.retryCount = 0;
    } catch (error) {
      this.retryCount++;
      if (this.retryCount < this.maxRetries) {
        this.logger.warn(
          `Database connection failed (attempt ${this.retryCount}/${this.maxRetries}). Retrying in ${this.retryDelay}ms...`,
        );
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        await this.connectWithRetry();
      } else {
        this.logger.error(
          `Failed to connect to database after ${this.maxRetries} attempts. ${error.message}`,
        );
        throw error;
      }
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
