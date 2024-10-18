import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { emailTemplateTable, wildcardTable } from '@/infra/drizzle/schemas';
import { eq } from 'drizzle-orm';
import { EmailTemplateErrors } from '../email-template.errors';
import { FormattedEmailTemplate } from '../list-email-templates/list-email-templates.usecase';

@Injectable()
export class FindEmailTemplateUseCase {
  constructor(private readonly drizzle: DrizzleService) {}

  async exec(id: string): Promise<FormattedEmailTemplate> {
    const templateWithWildcards = await this.drizzle.db
      .select()
      .from(emailTemplateTable)
      .where(eq(emailTemplateTable.id, id))
      .leftJoin(
        wildcardTable,
        eq(emailTemplateTable.id, wildcardTable.templateId),
      );

    if (!templateWithWildcards.length) {
      throw new NotFoundException(EmailTemplateErrors.TEMPLATE_NOT_FOUND);
    }

    const formattedTemplate: FormattedEmailTemplate = {
      id: templateWithWildcards[0].email_template.id,
      title: templateWithWildcards[0].email_template.title,
      html: templateWithWildcards[0].email_template.html,
      createdAt: templateWithWildcards[0].email_template.createdAt,
      updatedAt: templateWithWildcards[0].email_template.updatedAt,
      wildcards: templateWithWildcards.reduce<
        FormattedEmailTemplate['wildcards']
      >((acc, row) => {
        if (row.wildcard) {
          acc.push({
            id: row.wildcard.id,
            type: row.wildcard.type,
            label: row.wildcard.label,
            templateId: row.wildcard.templateId,
          });
        }
        return acc;
      }, []),
    };

    return formattedTemplate;
  }
}
