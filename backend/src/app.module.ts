import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { Item } from './items/item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'database'), // Safe default fallback
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'fetcher'), // Safe default fallback
        password: config.get<string>('DB_PASSWORD', 'password123'), // Safe default fallback
        database: config.get<string>('DB_DATABASE', 'inventory'), // Safe default fallback
        entities: [Item],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: true, // <--- CHANGE THIS FROM false TO true
      }),
    }),
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
