import { Module } from '@nestjs/common';
import { HandleCreateCustomerConsumer } from './handle-customer-consumer/handle-create-customer.consumer';
import { HandleCreateCustomerUseCase } from './handle-customer-consumer/handle-create-customer.usecase';

@Module({
  imports: [],
  providers: [HandleCreateCustomerConsumer, HandleCreateCustomerUseCase],
})
export class ConsumersModule {}
