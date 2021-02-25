import { Injectable } from '@nestjs/common';
import { UnsupportedMediaTypeException } from '@nestjs/common';
import sharp from 'sharp';
import decode from 'heic-decode';
import PNGReader from 'imagetracerjs/nodecli/PNGReader';
import ImageTracer from 'imagetracerjs';
import svgo from 'svgo';
import tinycolor from 'tinycolor2';

export enum ColorMode {
  COLOR = 'color',
  BLACK_AND_WHITE = 'black-and-white',
}

@Injectable()
export class ImagetracerjsService {
  // ensure file type is image
  validateFileType(file: Express.Multer.File) {
    if (
      [
        'image/jpg',
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'image/heic',
      ].includes(file.mimetype)
    ) {
      return file;
    } else {
      throw new UnsupportedMediaTypeException();
    }
  }

  // convert all images to png
  // resize png to max width or height of 1000
  async getPng(file: Express.Multer.File) {
    let image: sharp.Sharp;
    if (file.mimetype === 'image/heic') {
      // if heic, perform a manual conversion
      const {
        width, // integer width of the image
        height, // integer height of the image
        data, // ArrayBuffer containing decoded raw image data
      } = await decode({ buffer: file.buffer });

      // ArrayBuffer to Buffer https://stackoverflow.com/a/12101012
      image = await sharp(Buffer.from(data), {
        raw: { width, height, channels: 4 },
      });
    } else {
      // else, use sharp to convert the image to png
      image = await sharp(file.buffer);
    }

    const metadata = await image.metadata();

    const largestDimension =
      metadata.width > metadata.height ? 'width' : 'height';
    const ratio = 1000 / metadata[largestDimension];
    const dimensions = {
      width: Math.round(metadata.width * ratio),
      height: Math.round(metadata.height * ratio),
    };

    return image
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .resize(dimensions.width, dimensions.height, {
        withoutEnlargement: true,
        fit: 'cover',
      })
      .png()
      .toBuffer();
  }

  async getImageData(png: Buffer) {
    // follow the imagetracerjs example
    // https://github.com/jankovicsandras/imagetracerjs/blob/master/nodecli/nodecli.js
    const reader = new PNGReader(png);
    const imageData = await new Promise((resolve, reject) => {
      reader.parse(function (error, png) {
        if (error) return reject(error);
        // creating an ImageData object
        return resolve({
          width: png.width,
          height: png.height,
          data: png.pixels,
        });
      });
    });
    return imageData;
  }

  getPosterizedSvg(imageData: { width: number; height: number; data: Buffer }) {
    // Generate svg
    // https://github.com/jankovicsandras/imagetracerjs/blob/master/options.md
    // const imageTracerOptions = { colorsampling:0, numberofcolors:2 } || "posterized1"
    return ImageTracer.imagedataToSVG(imageData, 'posterized1');
  }

  async getOptimizedSvg(svg: string) {
    return (await svgo.optimize(svg)).data;
  }

  getMonochromeSvg(svg: string) {
    // get array of all unique hex colors
    // const regex = /rgb\(\d{1,3},\d{1,3},\d{1,3}\)/
    const regex = /#([a-f0-9]{3}){1,2}\b/gi;
    const matches = svg.match(regex);
    const colors = Array.from(new Set(matches));

    // calculate color brightness
    let brightnesses = colors.map((color) => ({
      color,
      brightness: tinycolor(color).getBrightness(),
    }));

    // if only one color, add white or black
    if (brightnesses.length === 1) {
      if (Math.round(brightnesses[0].brightness / 256) < 0.5) {
        brightnesses.push({
          color: '#FFF',
          brightness: 255,
        });
      } else {
        brightnesses.unshift({
          color: '#000',
          brightness: 0,
        });
      }
      // if >2 colors, convert to 2 colors
    } else if (brightnesses.length > 2) {
      brightnesses.sort((lumA, lumB) => lumA.brightness - lumB.brightness);
      // find lightest and darkest extremes to guarantee white and black
      const extremes = [brightnesses.shift(), brightnesses.pop()];
      // replace all other colors with white or black, whichever closest
      for (const brightness of brightnesses) {
        svg = svg.replaceAll(
          brightness.color,
          Math.round(brightness.brightness / 256) ? '#FFF' : '#000',
        );
      }
      brightnesses = extremes;
    }
    // replace lighter color with white,
    // and darker color with black
    return svg
      .replaceAll(
        brightnesses[0].color,
        brightnesses[0].color > brightnesses[1].color ? '#FFF' : '#000',
      )
      .replaceAll(
        brightnesses[1].color,
        brightnesses[1].color > brightnesses[0].color ? '#FFF' : '#000',
      );
  }

  getColorSvg(imageData: { width: number; height: number; data: Buffer }) {
    // Generate svg
    // https://github.com/jankovicsandras/imagetracerjs/blob/master/options.md
    return ImageTracer.imagedataToSVG(imageData);
  }

  async processFiles(files: Express.Multer.File[], colorMode: ColorMode) {
    return Promise.all(
      files.map((file, index) =>
        Promise.resolve(file)
          .then(this.validateFileType)
          .then(this.getPng)
          .then(this.getImageData)
          .then((input) => {
            switch (colorMode) {
              case ColorMode.COLOR:
                return Promise.resolve(input)
                  .then(this.getColorSvg)
                  .then(this.getOptimizedSvg);
              case ColorMode.BLACK_AND_WHITE:
                return Promise.resolve(input)
                  .then(this.getPosterizedSvg)
                  .then(this.getOptimizedSvg)
                  .then(this.getMonochromeSvg);
            }
          })
          .then((file) => ({
            svg: file,
            fieldName: files[index].fieldname,
            originalName: files[index].originalname,
            mimeType: files[index].mimetype,
          })),
      ),
    );
  }
}
