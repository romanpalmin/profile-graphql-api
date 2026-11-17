import { Field, ID, ObjectType } from '@nestjs/graphql';

// Достижения (achievements) добавляет ExperienceResolver через @ResolveField.
@ObjectType({ description: 'Место работы' })
export class Experience {
  @Field(() => ID)
  id: number;

  @Field()
  company: string;

  @Field()
  position: string;

  // Date превращается в скаляр DateTime (ISO-строка); в БД колонка date без времени.
  @Field(() => Date)
  startDate: Date;

  @Field(() => Date, { nullable: true, description: 'null означает «по настоящее время»' })
  endDate: Date | null;
}
