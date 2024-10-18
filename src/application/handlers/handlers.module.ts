import { Module } from '@nestjs/common';
import { HandleSendEmailConsumer } from './consumers/handle-send-email/handle-send-email.consumer';
import { HandleSendEmailUseCase } from './consumers/handle-send-email/handle-send-email.usecase';
import { EmailService } from '@/infra/email/email.service';
import { ResendService } from '@/infra/resend/resend.service';
import { R2Service } from '@/infra/r2/r2.service';
import { ConsumersModule } from './consumers/consumers.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [ConsumersModule, WebhooksModule],
  providers: [
    HandleSendEmailConsumer,
    HandleSendEmailUseCase,
    EmailService,
    ResendService,
    R2Service,
  ],
})
export class HandlersModule {}
