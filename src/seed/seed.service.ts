import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma';
import { User } from '../users/entities/user.entity';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/entities/item.entity';
import { ListsService } from '../lists/lists.service';
import { ListItemService } from '../list-item/list-item.service';
import { List } from '../lists/entities/list.entity';

@Injectable()
export class SeedService extends PrismaClient implements OnModuleInit {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly itemsService: ItemsService,
    private readonly listItemService: ListItemService,
    private readonly listsService: ListsService,
    private readonly usersService: UsersService,
  ) {
    super();
    this.isProd = configService.get('STAGE') === 'prod';
  }

  async onModuleInit() {
    await this.$connect();
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd)
      throw new BadRequestException('You cannot execute SEED in Prod');

    await this.deleteDatabase();

    const user = await this.loadUsers();

    await this.loadItems(user);

    const list = await this.loadLists(user);

    const items = await this.itemsService.findAll(
      user,
      { limit: 15, offset: 0 },
      {},
    );
    await this.loadListItems(list, items);

    return true;
  }

  async deleteDatabase(): Promise<void> {
    await this.listItem.deleteMany();

    await this.list.deleteMany();

    await this.item.deleteMany();

    await this.user.deleteMany();
  }

  async loadUsers(): Promise<User> {
    const users: User[] = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const items: Promise<Item>[] = [];

    for (const item of SEED_ITEMS) {
      items.push(this.itemsService.create(item, user));
    }

    await Promise.all(items);
  }

  async loadLists(user: User): Promise<List> {
    const lists: List[] = [];

    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }

    return lists[0];
  }

  async loadListItems(list: List, items: Item[]): Promise<void> {
    for (const item of items) {
      await this.listItemService.create({
        quantity: Math.round(Math.random() * 10),
        completed: Math.round(Math.random() * 1) === 0 ? false : true,
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
