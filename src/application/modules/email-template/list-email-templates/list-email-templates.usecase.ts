import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { emailTemplateTable, wildcardTable } from '@/infra/drizzle/schemas';
import { eq } from 'drizzle-orm';

export interface FormattedEmailTemplate {
  id: string;
  title: string;
  html: string;
  wildcards: {
    id: string;
    type: string;
    label: string;
    templateId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ListEmailTemplatesUseCase {
  constructor(private readonly drizzle: DrizzleService) {}

  async exec() {
    const templatesWithWildcards = await this.drizzle.db
      .select()
      .from(emailTemplateTable)
      .leftJoin(
        wildcardTable,
        eq(emailTemplateTable.id, wildcardTable.templateId),
      );

    const formattedTemplates = templatesWithWildcards.reduce<
      FormattedEmailTemplate[]
    >((acc, row) => {
      const templateId = row.email_template.id;
      const existingTemplateIndex = acc.findIndex((t) => t.id === templateId);

      if (existingTemplateIndex !== -1) {
        if (row.wildcard) {
          acc[existingTemplateIndex].wildcards.push({
            id: row.wildcard.id,
            type: row.wildcard.type,
            label: row.wildcard.label,
            templateId: row.wildcard.templateId,
          });
        }
      } else {
        acc.push({
          id: templateId,
          title: row.email_template.title,
          html: row.email_template.html,
          createdAt: row.email_template.createdAt,
          updatedAt: row.email_template.updatedAt,
          wildcards: row.wildcard
            ? [
                {
                  id: row.wildcard.id,
                  type: row.wildcard.type,
                  label: row.wildcard.label,
                  templateId: row.wildcard.templateId,
                },
              ]
            : [],
        });
      }

      return acc;
    }, []);

    return formattedTemplates;
  }
}
