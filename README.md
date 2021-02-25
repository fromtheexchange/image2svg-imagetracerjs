# image2svg-imagetracerjs

Server to convert images to svg using the imagetracerjs algorithm.

## Related repositories

- [image2svg-awesome](https://github.com/fromtheexchange/image2svg-awesome)
- [image2svg-imagetracerjs](https://github.com/fromtheexchange/image2svg-imagetracerjs)
- [image2svg-potrace](https://github.com/fromtheexchange/image2svg-potrace)
- [image2svg-primitive](https://github.com/fromtheexchange/image2svg-primitive)
- [image2svg-kvec](https://github.com/fromtheexchange/image2svg-kvec)

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

To install and run this project, you will need:

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/package/npm)
- [Docker](https://www.docker.com/products/docker-desktop)
- [ClaudiaJS](https://www.npmjs.com/package/claudia)

### Installing

These step by step instructions will help you get a development environment up and running:

```bash
git clone https://github.com/fromtheexchange/image2svg-imagetracerjs
cd image2svg-imagetracerjs
npm install
npm start:dev
```

Your image endpoints are:

- [http://localhost:4002/imagetracerjs/color](http://localhost:4002/imagetracerjs/color)
- [http://localhost:4002/imagetracerjs/black-and-white](http://localhost:4002/imagetracerjs/color)

Send your images to convert as [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

## Deployment

### Vercel

Be sure you have created a Vercel account and are signed in.

```bash
npm run build
vercel --prod
```

Override the default setting for the `Output Directory`. Use `dist`.

### ClaudiaJS

Be sure you have:

- installed Docker
- installed ClaudiaJS globally
- configured your AWS keys

```bash
npm run create
```

## Built with

- [Readme Template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) - The Readme template
- [NestJS](https://nestjs.com/) - The server framework
- [Vercel](https://vercel.com/) - Serverless hosting
- [ClaudiaJS](https://www.npmjs.com/package/claudia) - Serverless hosting
- [sharp](https://www.npmjs.com/package/sharp) - Image conversion
- [imagetracerjs](https://www.npmjs.com/package/imagetracerjs) - Image tracing

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## License

This project is licensed under the [MIT License](LICENSE.md).

# NestJS

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
