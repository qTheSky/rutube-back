import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthDto } from './auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    return {
      user: this.returnUserFields(user),
      accessToken: await this.issueAccessToken(user.id),
    };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userRepo.findOneBy({ email: dto.email });
    if (oldUser) throw new BadRequestException('Email is busy');

    const salt = await genSalt(10);

    const newUser = await this.userRepo.create({
      email: dto.email,
      password: await hash(dto.password, salt),
    });

    const user = await this.userRepo.save(newUser);

    return {
      user: this.returnUserFields(user),
      accessToken: await this.issueAccessToken(user.id),
    };
  }

  async validateUser(dto: AuthDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'password'],
    });
    if (!user) throw new NotFoundException('User not found');

    const isValidPassword = await compare(dto.password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Password is wrong');

    return user;
  }

  async issueAccessToken(userId: number) {
    const data = { id: userId };

    return await this.jwtService.signAsync(data, { expiresIn: '31d' });
  }

  returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
