import { Module } from '@nestjs/common';
import { MenuRepository } from './repositories/menu.repository';
import { MenuService } from './services/menu.service';
import { MenuController } from './controllers/menu.controller';

@Module({
  controllers: [MenuController],
  providers: [MenuRepository, MenuService],
  exports: [MenuRepository, MenuService],
})
export class MenuModule {}
