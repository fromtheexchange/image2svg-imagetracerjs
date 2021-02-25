import { Module } from '@nestjs/common';
import { ImagetracerjsModule } from '../imagetracerjs/imagetracerjs.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ImagetracerjsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
