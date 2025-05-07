import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Optional: makes it available across all modules
      envFilePath: '.env',
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5456,
    //   username: 'jobs-board',
    //   password: 'jobs-board',
    //   database: 'jobs-board',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: false,
    //   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    // }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
