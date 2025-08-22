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
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // async findAll(): Promise<User> {
  //   return [];
  // }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.user.findUniqueOrThrow({ where: { email } });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.user.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // block(id: string): Promise<User> {
  //   throw new Error('method not implemented');
  // }

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
