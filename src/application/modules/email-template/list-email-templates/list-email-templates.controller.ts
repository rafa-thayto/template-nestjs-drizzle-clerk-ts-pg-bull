import { Controller, Get } from '@nestjs/common';
import { ListEmailTemplatesUseCase } from './list-email-templates.usecase';
import { Response } from 'src/core/dtos/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Email Templates')
@Controller('v1')
export class ListEmailTemplatesController {
  constructor(
    private readonly listEmailTemplatesUseCase: ListEmailTemplatesUseCase,
  ) {}

  @Get('email-templates')
  async listEmailTemplates() {
    const emailTemplates = await this.listEmailTemplatesUseCase.exec();
    return new Response(emailTemplates);
  }
}
