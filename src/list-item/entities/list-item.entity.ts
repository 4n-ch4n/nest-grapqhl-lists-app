import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from '../../items/entities/item.entity';
import { Item as ItemPrisma } from 'generated/prisma';
import { List as ListPrisma } from 'generated/prisma';
import { List } from 'src/lists/entities/list.entity';

@ObjectType()
export class ListItem {
  @Field(() => ID)
  id: string;

  @Field(() => Number)
  quantity: number;

  @Field(() => Boolean)
  completed: boolean;

  @Field(() => List)
  list: ListPrisma;

  @Field(() => Item)
  item: ItemPrisma;
}
