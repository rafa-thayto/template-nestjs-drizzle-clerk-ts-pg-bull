import { Controller, Get, Param } from '@nestjs/common';
import { FindEmailTemplateUseCase } from './find-email-template.usecase';
import { Response } from 'src/core/dtos/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Email Templates')
@Controller('v1')
export class FindEmailTemplateController {
  constructor(
    private readonly findEmailTemplateUseCase: FindEmailTemplateUseCase,
  ) {}

  @Get('/email-template/:id')
  async findEmailTemplate(@Param('id') id: string) {
    const emailTemplate = await this.findEmailTemplateUseCase.exec(id);

    return new Response(emailTemplate);
  }
}
