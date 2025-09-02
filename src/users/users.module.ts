import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ItemsModule } from '../items/items.module';
import { ListsModule } from '../lists/lists.module';

@Module({
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
  imports: [ItemsModule, ListsModule],
})
export class UsersModule {}
