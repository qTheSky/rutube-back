import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from './video.entity';
import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm';
import { VideoDto } from './video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepo: Repository<VideoEntity>,
  ) {}

  async findByIdOrThrow(id: number, isPublic = false) {
    const video = await this.videoRepo.findOne({
      where: isPublic ? { id, isPublic: true } : { id },
      relations: {
        user: true,
        comments: { user: true },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
          subscribersCount: true,
          subscriptions: true,
        },
        comments: {
          message: true,
          id: true,
          user: {
            id: true,
            name: true,
            avatarPath: true,
            isVerified: true,
            subscribersCount: true,
          },
        },
      },
    });
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  async update(id: number, dto: VideoDto) {
    const video = await this.findByIdOrThrow(id);
    return this.videoRepo.save({ ...video, ...dto });
  }

  async getAll(searchTerm?: string) {
    const options: FindOptionsWhereProperty<VideoEntity> = {};
    if (searchTerm) {
      options.name = ILike(`%${searchTerm}%`);
    }
    return this.videoRepo.find({
      where: { ...options, isPublic: true },
      order: { createdAt: 'DESC' },
      relations: { user: true, comments: { user: true } },
      select: {
        user: { id: true, name: true, avatarPath: true, isVerified: true },
      },
    });
  }

  async getMostPopularByViews() {
    return this.videoRepo.find({
      where: { views: MoreThan(0) },
      relations: { user: true },
      select: {
        user: { id: true, name: true, avatarPath: true, isVerified: true },
      },
      order: { views: -1 },
    });
  }

  async create(userId: number) {
    const defaultValues = {
      name: '',
      user: { id: userId },
      videoPath: '',
      description: '',
      thumbnailPath: '',
    };

    const newVideo = this.videoRepo.create(defaultValues);
    const video = await this.videoRepo.save(newVideo);
    return video.id;
  }

  async delete(id: number) {
    return this.videoRepo.delete({ id });
  }

  async updateCountViews(id: number) {
    const video = await this.findByIdOrThrow(id);
    video.views++;
    return this.videoRepo.save(video);
  }

  async updateReaction(id: number) {
    const video = await this.findByIdOrThrow(id);
    video.likes++;
    return this.videoRepo.save(video);
  }
}
