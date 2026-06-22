import { Injectable } from '@nestjs/common';
import { MenuCategory, MenuItem } from '@prisma/client';
import { MenuRepository } from '../repositories/menu.repository';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepo: MenuRepository) {}

  findAll() {
    return this.menuRepo.findAll();
  }

  search(keyword?: string, category?: MenuCategory) {
    return this.menuRepo.search(keyword, category);
  }

  create(data: Parameters<MenuRepository['create']>[0]) {
    return this.menuRepo.create(data);
  }

  update(id: string, data: Parameters<MenuRepository['update']>[1]) {
    return this.menuRepo.update(id, data);
  }

  delete(id: string) {
    return this.menuRepo.delete(id);
  }

  formatMenuForContext(items: Awaited<ReturnType<MenuRepository['search']>>) {
    if (!items.length) return '';
    return items
      .map((item: MenuItem) => {
        const price =
          Number(item.price) > 0
            ? `${item.price.toString()}đ/${item.unit}`
            : 'liên hệ báo giá';
        return `- ${item.name}: ${price}${item.isAvailable ? '' : ' (hết)'}${item.description ? ` — ${item.description}` : ''}`;
      })
      .join('\n');
  }
}
