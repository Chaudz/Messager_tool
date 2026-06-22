import { Injectable } from '@nestjs/common';
import { FaqCategory, FaqItem } from '@prisma/client';
import { FaqRepository } from '../repositories/faq.repository';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepo: FaqRepository) {}

  findAll() {
    return this.faqRepo.findAll();
  }

  findByCategory(category: FaqCategory) {
    return this.faqRepo.findByCategory(category);
  }

  create(data: Parameters<FaqRepository['create']>[0]) {
    return this.faqRepo.create(data);
  }

  update(id: string, data: Parameters<FaqRepository['update']>[1]) {
    return this.faqRepo.update(id, data);
  }

  delete(id: string) {
    return this.faqRepo.delete(id);
  }

  formatFaqsForContext(faqs: Awaited<ReturnType<FaqRepository['findAll']>>) {
    return faqs.map((f: FaqItem) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
  }
}
