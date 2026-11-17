import { Field, ID, ObjectType } from '@nestjs/graphql';

// GraphQL-тип «Профиль». Только скалярные поля: вложенные списки (links, skills, experience, projects)
// добавляются в ProfileResolver через @ResolveField, чтобы запрашивать их из БД только когда клиент их просит.
@ObjectType({ description: 'Профиль-визитка' })
export class Profile {
  @Field(() => ID)
  id: number;

  @Field()
  slug: string;

  @Field()
  name: string;

  @Field({ description: 'Должность, под которой представлен профиль' })
  title: string;

  @Field()
  description: string;

  @Field(() => String, { nullable: true })
  location: string | null;
}
