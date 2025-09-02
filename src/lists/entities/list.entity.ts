import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { User as UserPrisma } from 'generated/prisma';
import { ListItem as ListItemPrisma } from 'generated/prisma';

@ObjectType()
export class List {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => User)
  user: UserPrisma;

  listItem: ListItemPrisma[];
}
