import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { DatabaseModule } from '@app/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import getTypeOrmConfig from './ormconfig';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { StoryModule } from './story/story.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Optional: makes it available across all modules
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig),
    TagModule,
    UserModule,
    StoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.POST },
        { path: '/user/register', method: RequestMethod.POST },
        // { path: '/story/*', method: RequestMethod.ALL },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
