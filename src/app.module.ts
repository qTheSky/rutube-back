import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  getCloudTypeOrmConfig,
  getLocalTypeOrmConfig,
} from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:
        process.env.NODE_ENV === 'dev'
          ? getLocalTypeOrmConfig
          : getCloudTypeOrmConfig,
    }),
    UserModule,
    VideoModule,
    CommentModule,
    AuthModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
