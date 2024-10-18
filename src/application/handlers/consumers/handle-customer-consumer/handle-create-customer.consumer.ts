import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { HandleCreateCustomerUseCase } from './handle-create-customer.usecase';
import { Queues } from '@/domain/enums/queues';
import { CreateCustomerEvent } from '@/domain/events/create-customer.event';

@Processor(Queues.CREATE_CUSTOMER)
export class HandleCreateCustomerConsumer extends WorkerHost {
  private readonly logger = new Logger(HandleCreateCustomerConsumer.name);

  constructor(
    private readonly handleCreateCustomerUseCase: HandleCreateCustomerUseCase,
  ) {
    super();
  }

  async process(job: Job<CreateCustomerEvent, any, string>) {
    this.logger.log(`processing message: ${job.id}`);
    this.logger.debug('Data:', job.data);
    try {
      await this.handleCreateCustomerUseCase.exec(job.data);
    } catch (error: any) {
      // TODO: implements DLQ
      this.logger.log(job.attemptsMade);
      this.logger.error(`Error processing job: ${job.id}`, error.stack);
      throw new Error(`Error processing job: ${job.id}`);
    }
  }
}
