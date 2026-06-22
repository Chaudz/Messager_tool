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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const settings_repository_1 = require("../repositories/settings.repository");
let SettingsService = class SettingsService {
    settingsRepo;
    constructor(settingsRepo) {
        this.settingsRepo = settingsRepo;
    }
    get() {
        return this.settingsRepo.get();
    }
    update(id, data) {
        return this.settingsRepo.update(id, data);
    }
    async toggleAi(aiEnabled) {
        const settings = await this.get();
        return this.settingsRepo.update(settings.id, { aiEnabled });
    }
    formatOpeningHours(openingHours) {
        const labels = {
            mon: 'Thứ 2',
            tue: 'Thứ 3',
            wed: 'Thứ 4',
            thu: 'Thứ 5',
            fri: 'Thứ 6',
            sat: 'Thứ 7',
            sun: 'Chủ nhật',
        };
        return Object.entries(openingHours)
            .map(([key, value]) => `${labels[key] ?? key}: ${value}`)
            .join('\n');
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_repository_1.SettingsRepository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map