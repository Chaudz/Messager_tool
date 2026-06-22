import { Injectable } from '@nestjs/common';
import { ConversationStatus } from '@prisma/client';
import { ConversationRepository } from '../repositories/conversation.repository';

@Injectable()
export class ConversationService {
  constructor(private readonly conversationRepo: ConversationRepository) {}

  async getOrCreateActiveConversation(customerId: string, facebookThreadId?: string) {
    const existing = await this.conversationRepo.findActiveByCustomerId(customerId);
    if (existing) return existing;

    return this.conversationRepo.create({
      customer: { connect: { id: customerId } },
      facebookThreadId,
      status: 'ACTIVE',
      lastMessageAt: new Date(),
    });
  }

  findById(id: string) {
    return this.conversationRepo.findById(id);
  }

  findMany(page: number, limit: number, status?: ConversationStatus) {
    return this.conversationRepo.findMany({ page, limit, status });
  }

  async assignStaff(id: string, staffId: string) {
    return this.conversationRepo.update(id, {
      assignedStaffId: staffId,
      status: ConversationStatus.WAITING_HUMAN,
    });
  }

  close(id: string) {
    return this.conversationRepo.update(id, { status: ConversationStatus.CLOSED });
  }

  toggleAi(id: string, aiEnabled: boolean) {
    return this.conversationRepo.update(id, { aiEnabled });
  }

  markWaitingHuman(id: string) {
    return this.conversationRepo.update(id, {
      status: ConversationStatus.WAITING_HUMAN,
    });
  }

  /** Khách nhắn lại → mở lại hội thoại để AI tiếp tục xử lý */
  reactivateIfWaitingHuman(id: string) {
    return this.conversationRepo.update(id, {
      status: ConversationStatus.ACTIVE,
      assignedStaffId: null,
    });
  }

  touchLastMessage(id: string) {
    return this.conversationRepo.update(id, { lastMessageAt: new Date() });
  }
}
