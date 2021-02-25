import { createLambdaHandler } from 'create-vercel-http-server-handler';
import { AppModule } from './app/app.module';
import { useGlobal } from './useGlobal';

module.exports.handler = createLambdaHandler({
  AppModule,
  useGlobal,
});
