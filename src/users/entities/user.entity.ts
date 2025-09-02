import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item as ItemPrisma } from 'generated/prisma';
import { User as UserPrisma } from 'generated/prisma';
import { List as ListPrisma } from 'generated/prisma';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  fullName: string;

  @Field(() => String)
  email: string;

  password: string;

  @Field(() => [String])
  roles: string[];

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => User, { nullable: true })
  lastUpdateBy?: UserPrisma;

  items: ItemPrisma[];

  lists: ListPrisma[];
}
