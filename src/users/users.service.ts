import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaClient } from 'generated/prisma';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private logger = new Logger('UsersService');

  async onModuleInit() {
    await this.$connect();
  }

  async create(signupInput: SignupInput): Promise<User> {
    try {
      return await this.user.create({
        data: {
          ...signupInput,
          password: bcrypt.hashSync(signupInput.password, 10),
        },
        include: {
          items: true,
        },
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(
    roles: ValidRoles[],
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    if (roles.length === 0)
      return (await this.user.findMany({
        take: limit,
        skip: offset,
        where: {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        include: {
          lastUpdateBy: true,
          items: true,
        },
      })) as User[];

    return (await this.user.findMany({
      take: limit,
      skip: offset,
      where: {
        roles: {
          hasSome: roles,
        },
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: {
        lastUpdateBy: true,
        items: true,
      },
    })) as User[];
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.user.findUniqueOrThrow({
        where: { email },
        include: { items: true },
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.user.findUniqueOrThrow({
        where: { id },
        include: {
          items: true,
        },
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    user: User,
  ): Promise<User> {
    await this.findOneById(id);

    try {
      return (await this.user.update({
        where: { id },
        data: {
          lastUpdateBy: {
            connect: { id: user.id },
          },
          ...updateUserInput,
        },
        include: {
          lastUpdateBy: true,
          items: true,
        },
      })) as User;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, user: User): Promise<User> {
    await this.findOneById(id);

    return (await this.user.update({
      where: { id },
      data: {
        isActive: false,
        lastUpdateBy: {
          connect: { id: user.id },
        },
      },
      include: {
        lastUpdateBy: true,
        items: true,
      },
    })) as User;
  }

  private handleDBErrors(error: any): never {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === 'P2002')
      throw new BadRequestException('Email already exists');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === 'P2025') throw new NotFoundException('Term not found');

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
