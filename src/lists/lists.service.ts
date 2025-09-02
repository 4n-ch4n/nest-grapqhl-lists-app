import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ListsService extends PrismaClient implements OnModuleInit {
  private logger = new Logger('ItemsService');

  async onModuleInit() {
    await this.$connect();
  }

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    try {
      return await this.list.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          ...createListInput,
        },
        include: {
          user: true,
          listItem: true,
        },
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    return await this.list.findMany({
      take: limit,
      skip: offset,
      where: {
        user: { id: user.id },
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: {
        user: true,
        listItem: true,
      },
    });
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.list.findFirst({
      where: {
        id,
        user: { id: user.id },
      },
      include: {
        user: true,
        listItem: true,
      },
    });

    if (!list) throw new NotFoundException(`List with id ${id} not found`);

    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);

    try {
      return this.list.update({
        where: { id },
        data: updateListInput,
        include: {
          user: true,
          listItem: true,
        },
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string, user: User) {
    const list = await this.findOne(id, user);
    await this.list.delete({
      where: {
        id,
        user: { id: user.id },
      },
    });

    return list;
  }

  async listCountByUser(user: User): Promise<number> {
    return await this.list.count({
      where: {
        user: { id: user.id },
      },
    });
  }

  private handleDBErrors(error: any): never {
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
