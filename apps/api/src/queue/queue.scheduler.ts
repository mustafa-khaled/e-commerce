import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(QueueSchedulerService.name);

  constructor(
    @InjectQueue('inventory') private inventoryQueue: Queue,
    @InjectQueue('reporting') private reportingQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.inventoryQueue.add(
      'release-expired',
      {},
      {
        repeat: { every: 5 * 60 * 1000 },
        jobId: 'inventory-release-expired',
        removeOnComplete: true,
      },
    );

    await this.reportingQueue.add(
      'aggregate-daily',
      {},
      {
        repeat: { every: 24 * 60 * 60 * 1000 },
        jobId: 'reporting-aggregate-daily',
        removeOnComplete: true,
      },
    );

    this.logger.log('Recurring queue jobs scheduled');
  }
}
