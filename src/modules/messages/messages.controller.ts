import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '@/guards/auth.guard';

@ApiTags('conversations')
@Controller('conversations')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOkResponse()
  async getConversations(@CurrentUser() user: AuthenticatedRequest['user']) {
    return this.messagesService.getConversations(user as any);
  }

  @Get(':userId/messages')
  @ApiOkResponse()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getMessages(
    @Param('userId') userId: string,
    @CurrentUser() user: AuthenticatedRequest['user'],
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.messagesService.getMessages(
      user as any,
      userId,
      page ? Number(page) : undefined,
      pageSize ? Number(pageSize) : undefined,
    );
  }

  @Post(':userId/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  async sendMessage(
    @Param('userId') userId: string,
    @Body() body: CreateMessageDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.messagesService.sendMessage(user as any, userId, body);
  }
}
