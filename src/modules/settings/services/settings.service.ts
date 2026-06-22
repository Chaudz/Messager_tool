import { Injectable } from '@nestjs/common';
import { SettingsRepository } from '../repositories/settings.repository';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepo: SettingsRepository) {}

  get() {
    return this.settingsRepo.get();
  }

  update(id: string, data: Parameters<SettingsRepository['update']>[1]) {
    return this.settingsRepo.update(id, data);
  }

  async toggleAi(aiEnabled: boolean) {
    const settings = await this.get();
    return this.settingsRepo.update(settings.id, { aiEnabled });
  }

  formatOpeningHours(openingHours: Record<string, string>) {
    const labels: Record<string, string> = {
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
}
