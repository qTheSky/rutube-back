import {
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Body,
  ValidationPipe,
  UsePipes,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from './user.decorator';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return this.userService.findByIdOrThrow(id);
  }

  @Get('by-id/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.findByIdOrThrow(+id);
  }

  @Put()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async updateUser(@Param('id') id: string, @Body() dto: UserDto) {
    return this.userService.updateProfile(+id, dto);
  }

  @Patch('subscriber/:channelId')
  @HttpCode(200)
  @Auth()
  async subscribeToChannel(
    @CurrentUser('id') id: number,
    @Param('channelId') channelId: string,
  ) {
    return this.userService.subscribe(id, +channelId);
  }

  @Get()
  async getUsers() {
    return this.userService.getAll();
  }
}
