import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { SubscriptionEntity } from './subscription.entity';
import { UserDto } from './user.dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepo: Repository<SubscriptionEntity>,
  ) {}

  async findByIdOrThrow(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: {
        videos: true,
        subscriptions: { toChannel: true },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: number, dto: UserDto) {
    const user = await this.findByIdOrThrow(id);
    const isSameUser = await this.userRepo.findOneBy({ email: dto.email });
    if (isSameUser && id !== isSameUser.id) {
      throw new BadRequestException('Email is busy');
    }
    if (dto.password) {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt);
    }
    user.email = dto.email;
    user.name = dto.name;
    user.description = dto.description;
    user.avatarPath = dto.avatarPath;
    return this.userRepo.save(user);
  }

  async subscribe(id: number, channelId: number) {
    const data = {
      toChannel: { id: channelId },
      fromUser: { id },
    };

    const isSubscribed = await this.subscriptionRepo.findOneBy(data);
    if (!isSubscribed) {
      const newSubscription = await this.subscriptionRepo.create(data);
      await this.subscriptionRepo.save(newSubscription);
      return true;
    }
    this.subscriptionRepo.delete(data);
    return false;
  }

  async getAll() {
    return this.userRepo.find();
  }
}
