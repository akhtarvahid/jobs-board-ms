import { Controller, Get } from '@nestjs/common';

@Controller('story')
export class CommentController {
  @Get()
  health() {
    return 'up';
  }
}
