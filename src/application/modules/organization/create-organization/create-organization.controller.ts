import { Controller, Post } from '@nestjs/common';
import { CreateOrganizationUseCase } from './create-organization.usecase';
import { CreateOrganizationDto } from './create-organization.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Organizations')
@Controller('v1')
export class CreateOrganizationController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
  ) {}

  @Post('/organizations')
  async createOrganization(dto: CreateOrganizationDto) {
    const organization = await this.createOrganizationUseCase.exec(dto);

    return {
      success: true,
      organization,
    };
  }
}
