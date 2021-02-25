import { Module } from '@nestjs/common';
import { ImagetracerjsController } from './imagetracerjs.controller';
import { ImagetracerjsService } from './imagetracerjs.service';

@Module({
  controllers: [ImagetracerjsController],
  providers: [ImagetracerjsService]
})
export class ImagetracerjsModule {}
