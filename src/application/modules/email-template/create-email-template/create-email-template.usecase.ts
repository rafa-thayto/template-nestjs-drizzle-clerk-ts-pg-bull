import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { createId } from '@paralleldrive/cuid2';
import { UpsertEmailTemplateDTO } from './create-email-template.dto';
import emailTemplateTable from '@/infra/drizzle/schemas/email-template.schema';
import wildcardTable, {
  WildcardEntity,
} from '@/infra/drizzle/schemas/wildcard.schema';
import { eq, and, sql, notInArray } from 'drizzle-orm';

@Injectable()
export class CreateEmailTemplateUseCase {
  constructor(private readonly drizzle: DrizzleService) {}

  async exec(data: UpsertEmailTemplateDTO) {
    const { id, title, html, wildcards } = data;

    const templateId = await this.upsertEmailTemplate(id, title, html);
    const createdWildcards = await this.upsertWildcards(templateId, wildcards);

    return { id: templateId, title, html, wildcards: createdWildcards };
  }

  private async upsertEmailTemplate(
    id: string | undefined,
    title: string,
    html: string,
  ): Promise<string> {
    const templateId = id ?? createId();

    const upsertResult = await this.drizzle.db
      .insert(emailTemplateTable)
      .values({ id: templateId, title, html })
      .onConflictDoUpdate({
        target: emailTemplateTable.id,
        set: { html, title },
      })
      .returning({ id: emailTemplateTable.id });

    return upsertResult[0].id;
  }

  private async upsertWildcards(
    templateId: string,
    wildcards: UpsertEmailTemplateDTO['wildcards'],
  ): Promise<WildcardEntity[]> {
    const existingWildcards = await this.drizzle.db
      .select()
      .from(wildcardTable)
      .where(eq(wildcardTable.templateId, templateId));

    const wildcardUpserts = wildcards.map((wildcard) => {
      const existingWildcard = existingWildcards.find(
        (ew) => ew.label === wildcard.label,
      );
      return {
        id: existingWildcard?.id || wildcard.id || createId(),
        type: wildcard.type,
        label: wildcard.label,
        templateId,
      };
    });

    if (wildcardUpserts.length > 0) {
      await this.drizzle.db
        .insert(wildcardTable)
        .values(wildcardUpserts)
        .onConflictDoUpdate({
          target: [wildcardTable.templateId, wildcardTable.label],
          set: { type: sql`excluded.type` },
        });
    }

    await this.deleteRemovedWildcards(
      templateId,
      wildcards.map((w) => w.label),
    );

    return this.drizzle.db
      .select()
      .from(wildcardTable)
      .where(eq(wildcardTable.templateId, templateId));
  }

  private async deleteRemovedWildcards(
    templateId: string,
    currentLabels: string[],
  ) {
    const deleteCondition = and(
      eq(wildcardTable.templateId, templateId),
      notInArray(wildcardTable.label, currentLabels),
    );

    const wildcardToDelete = await this.drizzle.db
      .select()
      .from(wildcardTable)
      .where(deleteCondition);

    if (wildcardToDelete.length > 0) {
      await this.drizzle.db.delete(wildcardTable).where(deleteCondition);
    }
  }
}
