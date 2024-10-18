import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { CreditorModule } from './creditor/creditor.module';
import { InvoiceModule } from './invoice/invoice.module';
import { FileModule } from './file/file.module';
import { BatchModule } from './batch/batch.module';
import { SubsidiaryModule } from './subsidiary/subsidiary.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CustomerModule,
    CreditorModule,
    InvoiceModule,
    FileModule,
    BatchModule,
    OrganizationModule,
    SubsidiaryModule,
  ],
  providers: [],
  controllers: [],
})
export class UseCasesModule {}
