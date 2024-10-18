import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { createId } from '@paralleldrive/cuid2';
import { Queues } from '@/domain/enums/queues';
import { CreateCustomersDTO } from './create-customers.dto';
import { CreateCustomerEvent } from '@/domain/events/create-customer.event';
import { CreateBatchUseCase } from '../../batch/create-batch/create-batch.usecase';
import { Batches } from '@/domain/enums/batches';

@Injectable()
export class CreateCustomersUseCase {
  constructor(
    @InjectQueue(Queues.CREATE_CUSTOMER)
    private createCustomerQueue: Queue<CreateCustomerEvent>,
    private readonly createBatchUseCase: CreateBatchUseCase,
  ) {}

  async exec(data: CreateCustomersDTO) {
    const payload: CreateCustomerEvent = {
      batchId: createId(),
      customers: data.customers,
    };

    const batch = await this.createBatchUseCase.exec({
      type: Batches.CREATE_CUSTOMER,
      size: data.customers.length.toString(),
    });

    await this.createCustomerQueue.add(batch.integrationCode, payload);

    return batch;
  }
}
