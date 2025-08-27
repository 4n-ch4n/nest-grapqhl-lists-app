import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ItemsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    return await this.item.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        ...createItemInput,
      },
      include: {
        user: true,
      },
    });
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    return await this.item.findMany({
      take: limit,
      skip: offset,
      where: {
        user: {
          id: user.id,
        },
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: { user: true },
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.item.findUnique({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
      include: { user: true },
    });

    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);

    return await this.item.update({
      where: { id },
      data: updateItemInput,
      include: { user: true },
    });
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.item.delete({
      where: {
        id: item.id,
        user: {
          id: user.id,
        },
      },
    });

    return item;
  }

  async itemCountByUser(user: User): Promise<number> {
    return await this.item.count({
      where: {
        user: { id: user.id },
      },
    });
  }
}
