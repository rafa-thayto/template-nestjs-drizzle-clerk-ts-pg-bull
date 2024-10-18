import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UpsertEmailTemplateDTO } from './create-email-template.dto';
import { CreateEmailTemplateUseCase } from './create-email-template.usecase';
import { Response } from 'src/core/dtos/response.dto';
import { EmailTemplateErrors } from '../email-template.errors';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Email Templates')
@Controller('v1')
export class CreateEmailTemplateController {
  constructor(
    private readonly createEmailTemplateUseCase: CreateEmailTemplateUseCase,
  ) {}

  @Post('/email-template')
  async createEmailTemplate(@Body() body: UpsertEmailTemplateDTO) {
    const isValidBody = body && body.title && body.html && body.wildcards;
    if (!isValidBody) {
      throw new BadRequestException(EmailTemplateErrors.INVALID_DATA);
    }
    const emailTemplateData = await this.createEmailTemplateUseCase.exec(body);
    return new Response(emailTemplateData);
  }
}
