import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { User as UserPrisma } from 'generated/prisma';
@ObjectType()
export class Item {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  quantityUnits?: string | null;

  @Field(() => User)
  user: UserPrisma;
}
