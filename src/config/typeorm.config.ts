import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getLocalTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: 'localhost',
    port: configService.get('DPORT'),
    username: configService.get('DDATABASEUSERNAME'),
    password: configService.get('DPASSWORD'),
    database: configService.get('DDATABASE'),
    autoLoadEntities: true,
    synchronize: true,
  };
};
export const getCloudTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: `ep-falling-frost-826786.eu-central-1.aws.neon.tech`,
    port: configService.get('PPORT'),
    username: configService.get('PDATABASEUSERNAME'),
    password: configService.get('PPASSWORD'),
    database: configService.get('PDATABASE'),
    autoLoadEntities: true,
    synchronize: true,
    ssl: true,
  };
};
