import { Intent } from '@prisma/client';
import { FaqService } from '../../faq/services/faq.service';
import { MenuService } from '../../menu/services/menu.service';
import { SettingsService } from '../../settings/services/settings.service';
export interface GroundedContext {
    text: string;
    isEmpty: boolean;
    requiresData: boolean;
}
export declare class ContextBuilderService {
    private readonly settingsService;
    private readonly menuService;
    private readonly faqService;
    private readonly logger;
    constructor(settingsService: SettingsService, menuService: MenuService, faqService: FaqService);
    build(intent: Intent, keyword?: string): Promise<GroundedContext>;
}
