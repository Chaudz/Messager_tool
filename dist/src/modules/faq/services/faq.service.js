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
exports.FaqService = void 0;
const common_1 = require("@nestjs/common");
const faq_repository_1 = require("../repositories/faq.repository");
let FaqService = class FaqService {
    faqRepo;
    constructor(faqRepo) {
        this.faqRepo = faqRepo;
    }
    findAll() {
        return this.faqRepo.findAll();
    }
    findByCategory(category) {
        return this.faqRepo.findByCategory(category);
    }
    create(data) {
        return this.faqRepo.create(data);
    }
    update(id, data) {
        return this.faqRepo.update(id, data);
    }
    delete(id) {
        return this.faqRepo.delete(id);
    }
    formatFaqsForContext(faqs) {
        return faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
    }
};
exports.FaqService = FaqService;
exports.FaqService = FaqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [faq_repository_1.FaqRepository])
], FaqService);
//# sourceMappingURL=faq.service.js.map