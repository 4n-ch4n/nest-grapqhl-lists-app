import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { PrismaClient } from 'generated/prisma';
import { List } from '../lists/entities/list.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ListItemService extends PrismaClient implements OnModuleInit {
  private logger = new Logger('ListItemService');

  async onModuleInit() {
    await this.$connect();
  }

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;

    try {
      return await this.listItem.create({
        data: {
          ...rest,
          list: {
            connect: { id: listId },
          },
          item: {
            connect: { id: itemId },
          },
        },
        include: {
          item: true,
          list: true,
        },
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    return await this.listItem.findMany({
      take: limit,
      skip: offset,
      where: {
        list: {
          id: list.id,
        },
        item: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      include: {
        list: true,
        item: true,
      },
    });
  }

  async countListItemsByList(list: List): Promise<number> {
    return await this.listItem.count({
      where: {
        list: {
          id: list.id,
        },
      },
    });
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItem.findUnique({
      where: { id },
      include: {
        list: true,
        item: true,
      },
    });

    if (!listItem)
      throw new NotFoundException(`List item with id ${id} not found`);

    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    await this.findOne(id);

    try {
      return await this.listItem.update({
        where: { id },
        data: {
          ...updateListItemInput,
        },
        include: {
          list: true,
          item: true,
        },
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code) throw new BadRequestException('List or Item not found');

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
