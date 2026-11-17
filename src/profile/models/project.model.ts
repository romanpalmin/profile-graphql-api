import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Проект' })
export class Project {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field()
  description: string;

  @Field(() => [String])
  technologies: string[];
}
