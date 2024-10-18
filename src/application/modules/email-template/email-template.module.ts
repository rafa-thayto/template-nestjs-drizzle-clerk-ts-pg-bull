import { Module } from '@nestjs/common';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { CreateEmailTemplateUseCase } from './create-email-template/create-email-template.usecase';
import { CreateEmailTemplateController } from './create-email-template/create-email-template.controller';
import { FindEmailTemplateUseCase } from './find-email-template/find-email-template.usecase';
import { FindEmailTemplateController } from './find-email-template/find-email-template.controller';
import { ListEmailTemplatesUseCase } from './list-email-templates/list-email-templates.usecase';
import { ListEmailTemplatesController } from './list-email-templates/list-email-templates.controller';

@Module({
  providers: [
    CreateEmailTemplateUseCase,
    FindEmailTemplateUseCase,
    ListEmailTemplatesUseCase,
  ],
  controllers: [
    CreateEmailTemplateController,
    FindEmailTemplateController,
    ListEmailTemplatesController,
  ],
})
export class EmailTemplateModule {}
