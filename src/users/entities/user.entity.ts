import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from '../../items/entities/item.entity';
import { Item as ItemPrsima } from 'generated/prisma';
import { User as UserPrisma } from 'generated/prisma';

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

  @Field(() => [Item])
  items: ItemPrsima[];
}
