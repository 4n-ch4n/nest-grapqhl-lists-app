import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma';
import { User } from '../users/entities/user.entity';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/entities/item.entity';

@Injectable()
export class SeedService extends PrismaClient implements OnModuleInit {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly itemsService: ItemsService,
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

    return true;
  }

  async deleteDatabase(): Promise<void> {
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
}
