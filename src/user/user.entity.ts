import { Column, Entity, OneToMany } from 'typeorm';
import { VideoEntity } from '../video/video.entity';
import { Base } from '../utils/base';
import { SubscriptionEntity } from './subscription.entity';

@Entity('User')
export class UserEntity extends Base {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @Column({ default: 0, name: 'subscribers_count' })
  subscribersCount?: number;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column({ default: '', name: 'avatar_path' })
  avatarPath: string;

  @OneToMany(() => VideoEntity, (v) => v.user)
  videos: VideoEntity[];
  @OneToMany(() => SubscriptionEntity, (s) => s.fromUser)
  subscriptions: SubscriptionEntity[];
  @OneToMany(() => SubscriptionEntity, (s) => s.toChannel)
  subscribers: SubscriptionEntity[];
}
