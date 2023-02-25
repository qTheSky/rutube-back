import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('media'))
  async uploadFile(
    @UploadedFile() mediaFile: Express.Multer.File,
    @Query() folder?: string,
  ) {
    return this.mediaService.saveMedia(mediaFile, folder);
  }
}
