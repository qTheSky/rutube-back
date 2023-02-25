import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Body,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/user.decorator';
import { VideoDto } from './video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('get-private/:id')
  @Auth()
  async getPrivateVideo(@Param('id') id: string) {
    return this.videoService.findByIdOrThrow(+id);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.videoService.getAll(searchTerm);
  }

  @Get('most-popular')
  async getMostPopularByViews() {
    return this.videoService.getMostPopularByViews();
  }

  @Get(':id')
  async getVideo(@Param('id') id: string) {
    return this.videoService.findByIdOrThrow(+id);
  }

  @Post()
  @HttpCode(200)
  @Auth()
  async createVideo(@CurrentUser('id') id: string) {
    return this.videoService.create(+id);
  }

  @Put(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth()
  async updateVideo(@Param('id') id: string, @Body() dto: VideoDto) {
    return this.videoService.update(+id, dto);
  }

  @Delete(':id')
  @Auth()
  async deleteVideo(@Param('id') id: string) {
    return this.videoService.delete(+id);
  }

  @Put('update-views/:videoId')
  async updateViews(@Param('videoId') videoId: string) {
    return this.videoService.updateCountViews(+videoId);
  }

  @Put('update-likes/:videoId')
  async updateLikes(@Param('videoId') videoId: string) {
    return this.videoService.updateReaction(+videoId);
  }
}
