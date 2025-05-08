import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { DatabaseModule } from '@app/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import getTypeOrmConfig from './ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Optional: makes it available across all modules
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig),
    TagModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
