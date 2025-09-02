import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { ListItemModule } from '../list-item/list-item.module';

@Module({
  providers: [ListsResolver, ListsService],
  exports: [ListsService],
  imports: [ListItemModule],
})
export class ListsModule {}
