import { Controller, Get } from '@nestjs/common';

@Controller('story')
export class StoryController {
  @Get('health')
  health() {
    return 'up';
  }
}
