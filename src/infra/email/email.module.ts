import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ResendModule } from '../resend/resend.module';

@Module({
  imports: [ResendModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
