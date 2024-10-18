import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queues } from '@/domain/enums/queues';
import { CreateCustomersController } from './create-customers/create-customers.controller';
import { ListCustomersController } from './list-customers/list-customers.controller';
import { CreateCustomersUseCase } from './create-customers/create-customers.usecase';
import { ListCustomersUseCase } from './list-customers/list-customers.usecase';
import { CreateCustomersSyncController } from './create-customers-sync/create-customers-sync.controller';
import { CreateCustomersSyncUseCase } from './create-customers-sync/create-customers-sync.usecase';
import { CreateBatchUseCase } from '../batch/create-batch/create-batch.usecase';

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queues.CREATE_CUSTOMER,
    }),
    BullBoardModule.forFeature({
      name: Queues.CREATE_CUSTOMER,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [
    CreateCustomersController,
    ListCustomersController,
    CreateCustomersSyncController,
  ],
  providers: [
    CreateCustomersUseCase,
    ListCustomersUseCase,
    CreateCustomersSyncUseCase,
    CreateBatchUseCase,
  ],
})
export class CustomerModule {}
