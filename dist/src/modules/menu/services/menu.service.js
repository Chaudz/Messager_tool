"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const menu_repository_1 = require("../repositories/menu.repository");
let MenuService = class MenuService {
    menuRepo;
    constructor(menuRepo) {
        this.menuRepo = menuRepo;
    }
    findAll() {
        return this.menuRepo.findAll();
    }
    search(keyword, category) {
        return this.menuRepo.search(keyword, category);
    }
    create(data) {
        return this.menuRepo.create(data);
    }
    update(id, data) {
        return this.menuRepo.update(id, data);
    }
    delete(id) {
        return this.menuRepo.delete(id);
    }
    formatMenuForContext(items) {
        if (!items.length)
            return '';
        return items
            .map((item) => `- ${item.name}: ${item.price.toString()}đ/${item.unit}${item.isAvailable ? '' : ' (hết)'}${item.description ? ` — ${item.description}` : ''}`)
            .join('\n');
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [menu_repository_1.MenuRepository])
], MenuService);
//# sourceMappingURL=menu.service.js.map