import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyConversationDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
