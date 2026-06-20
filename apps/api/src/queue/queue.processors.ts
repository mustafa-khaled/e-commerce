import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OrderService } from '@/order/order.service';
import { ReportingService } from '@/reporting/reporting.service';
import { InventoryService } from '@/inventory/inventory.service';

@Injectable()
@Processor('email')
export class EmailProcessor extends WorkerHost {
  private logger = new Logger(EmailProcessor.name);

  constructor(private mailerService: MailerService) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'campaign') {
      const { to, subject } = job.data;
      if (process.env.EMAIL_USER) {
        await this.mailerService.sendMail({
          to,
          subject,
          html: `<p>Campaign: ${subject}</p>`,
        });
      }
    }
    this.logger.log(`Processed email job ${job.id}`);
  }
}

@Injectable()
@Processor('order')
export class OrderProcessor extends WorkerHost {
  private logger = new Logger(OrderProcessor.name);

  constructor(private orderService: OrderService) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'release-reservation') {
      await this.orderService.cancelOrder(job.data.orderId);
    }
    this.logger.log(`Processed order job ${job.id}`);
  }
}

@Injectable()
@Processor('reporting')
export class ReportingProcessor extends WorkerHost {
  private logger = new Logger(ReportingProcessor.name);

  constructor(private reportingService: ReportingService) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'aggregate-daily' || !job.name) {
      await this.reportingService.aggregateDaily();
    }
    this.logger.log(`Processed reporting job ${job.id}`);
  }
}

@Injectable()
@Processor('inventory')
export class InventoryProcessor extends WorkerHost {
  private logger = new Logger(InventoryProcessor.name);

  constructor(private inventoryService: InventoryService) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'release-expired') {
      const count = await this.inventoryService.releaseExpiredReservations();
      this.logger.log(`Released ${count} expired reservations`);
    }
  }
}
