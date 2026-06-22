import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConversationStatus } from '@prisma/client';
import { ApiResponse } from '../../../common/utils/api-response';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ConversationService } from '../services/conversation.service';
import { ReplyConversationDto } from '../dtos/reply-conversation.dto';
import { MessageService } from '../../message/services/message.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  JOB_SEND_MESSAGE,
  QUEUE_SEND_MESSAGE,
} from '../../../queues/queue.constants';

@Controller('admin/v1/conversations')
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    @InjectQueue(QUEUE_SEND_MESSAGE) private readonly sendQueue: Queue,
  ) {}

  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: ConversationStatus,
  ) {
    const [items, total] = await this.conversationService.findMany(
      Number(page),
      Number(limit),
      status,
    );
    return ApiResponse.ok(items, {
      page: Number(page),
      limit: Number(limit),
      total,
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const conversation = await this.conversationService.findById(id);
    return ApiResponse.ok(conversation);
  }

  @Post(':id/reply')
  async reply(@Param('id') id: string, @Body() dto: ReplyConversationDto) {
    const conversation = await this.conversationService.findById(id);
    if (!conversation) {
      return ApiResponse.fail('NOT_FOUND', 'Conversation not found');
    }

    const message = await this.messageService.createOutboundStaffMessage(
      id,
      dto.content,
    );

    await this.sendQueue.add(JOB_SEND_MESSAGE, {
      conversationId: id,
      recipientPsid: conversation.customer.facebookPsid,
      text: dto.content,
      messageId: message.id,
    });

    return ApiResponse.ok(message);
  }

  @Patch(':id/close')
  async close(@Param('id') id: string) {
    const conversation = await this.conversationService.close(id);
    return ApiResponse.ok(conversation);
  }

  @Patch(':id/toggle-ai')
  async toggleAi(
    @Param('id') id: string,
    @Body('aiEnabled') aiEnabled: boolean,
  ) {
    const conversation = await this.conversationService.toggleAi(id, aiEnabled);
    return ApiResponse.ok(conversation);
  }

  @Patch(':id/assign')
  async assign(
    @Param('id') id: string,
    @Body('staffId') staffId: string,
  ) {
    const conversation = await this.conversationService.assignStaff(id, staffId);
    return ApiResponse.ok(conversation);
  }
}
