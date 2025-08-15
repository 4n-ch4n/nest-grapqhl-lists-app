import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { PrismaClient } from 'generated/prisma';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async create(createItemInput: CreateItemInput): Promise<Item> {
    return await this.item.create({ data: createItemInput });
  }

  async findAll(): Promise<Item[]> {
    return await this.item.findMany();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.item.findUnique({ where: { id } });

    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    await this.findOne(id);

    return await this.item.update({
      where: { id },
      data: updateItemInput,
    });
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id);
    await this.item.delete({ where: { id: item.id } });

    return item;
  }
}
