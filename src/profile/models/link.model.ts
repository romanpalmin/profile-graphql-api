import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Ссылка на профиль в сети (GitHub, LinkedIn, Telegram, hh и т.д.)' })
export class Link {
  @Field(() => ID)
  id: number;

  @Field()
  label: string;

  @Field()
  url: string;
}
