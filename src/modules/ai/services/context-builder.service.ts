import { Injectable, Logger } from '@nestjs/common';
import { FaqCategory, Intent } from '@prisma/client';
import { FaqService } from '../../faq/services/faq.service';
import { MenuService } from '../../menu/services/menu.service';
import { SettingsService } from '../../settings/services/settings.service';

export interface GroundedContext {
  text: string;
  isEmpty: boolean;
  requiresData: boolean;
}

@Injectable()
export class ContextBuilderService {
  private readonly logger = new Logger(ContextBuilderService.name);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly menuService: MenuService,
    private readonly faqService: FaqService,
  ) {}

  async build(intent: Intent, keyword?: string): Promise<GroundedContext> {
    const settings = await this.settingsService.get();
    const requiresData = !['GREETING', 'HUMAN_HANDOFF', 'UNKNOWN'].includes(intent);

    let contextParts: string[] = [
      `Tên nhà hàng: ${settings.restaurantName}`,
      `Địa chỉ: ${settings.address}`,
      `SĐT: ${settings.phone}`,
      `Giờ mở cửa:\n${this.settingsService.formatOpeningHours(settings.openingHours as Record<string, string>)}`,
    ];

    switch (intent) {
      case Intent.FAQ_OPENING_HOURS: {
        const faq = await this.faqService.findByCategory(FaqCategory.OPENING_HOURS);
        if (faq) contextParts.push(`FAQ: ${faq.answer}`);
        break;
      }
      case Intent.FAQ_ADDRESS: {
        const faq = await this.faqService.findByCategory(FaqCategory.ADDRESS);
        if (faq) contextParts.push(`FAQ: ${faq.answer}`);
        break;
      }
      case Intent.FAQ_PHONE: {
        const faq = await this.faqService.findByCategory(FaqCategory.PHONE);
        if (faq) contextParts.push(`FAQ: ${faq.answer}`);
        break;
      }
      case Intent.MENU_INQUIRY:
      case Intent.MENU_PRICE:
      case Intent.MENU_AVAILABILITY:
      case Intent.GENERAL_AI: {
        const items = await this.menuService.search(keyword);
        const menuText = this.menuService.formatMenuForContext(items);
        if (menuText) contextParts.push(`MENU:\n${menuText}`);
        const faqs = await this.faqService.findAll();
        const faqText = this.faqService.formatFaqsForContext(faqs);
        if (faqText) contextParts.push(`FAQ:\n${faqText}`);
        break;
      }
      default:
        break;
    }

    const text = contextParts.join('\n\n');
    const isEmpty =
      requiresData &&
      ['MENU_INQUIRY', 'MENU_PRICE', 'MENU_AVAILABILITY', 'GENERAL_AI'].includes(intent) &&
      !text.includes('MENU:');

    this.logger.debug(`Built context for intent ${intent}, empty=${isEmpty}`);
    return { text, isEmpty, requiresData };
  }
}
