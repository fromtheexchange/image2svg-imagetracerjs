import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Controller, Post } from '@nestjs/common';
import { ImagetracerjsService, ColorMode } from './imagetracerjs.service';

@Controller('imagetracerjs')
export class ImagetracerjsController {
  constructor(private readonly imagetracerjsService: ImagetracerjsService) {}

  @Post('color')
  @UseInterceptors(AnyFilesInterceptor())
  // File type https://stackoverflow.com/a/59325829
  async color(@UploadedFiles() files: Express.Multer.File[]) {
    const colorMode = ColorMode.COLOR;

    const processedFiles = await this.imagetracerjsService.processFiles(
      files,
      colorMode,
    );

    return {
      algorithm: 'imagetracerjs',
      colorMode,
      files: processedFiles,
    };
  }

  @Post('black-and-white')
  @UseInterceptors(AnyFilesInterceptor())
  // File type https://stackoverflow.com/a/59325829
  async blackAndWhite(@UploadedFiles() files: Express.Multer.File[]) {
    const colorMode = ColorMode.BLACK_AND_WHITE;

    const processedFiles = await this.imagetracerjsService.processFiles(
      files,
      colorMode,
    );

    return {
      algorithm: 'imagetracerjs',
      colorMode,
      files: processedFiles,
    };
  }
}
