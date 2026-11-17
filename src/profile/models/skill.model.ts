import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillLevel } from '../../generated/prisma/enums.js';

// Enum приходит из Prisma; GraphQL о нём не знает, пока его не зарегистрировать.
registerEnumType(SkillLevel, { name: 'SkillLevel', description: 'Уровень владения навыком' });

@ObjectType({ description: 'Навык' })
export class Skill {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  category: string;

  @Field(() => SkillLevel, { nullable: true })
  level: SkillLevel | null;

  @Field(() => String, { nullable: true, description: 'Пояснение («личные проекты» и т.п.)' })
  note: string | null;
}
