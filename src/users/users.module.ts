import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ItemsModule } from '../items/items.module';

@Module({
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
  imports: [ItemsModule],
})
export class UsersModule {}
