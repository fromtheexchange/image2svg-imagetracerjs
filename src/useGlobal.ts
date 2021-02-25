import helmet from 'helmet';
import { UseGlobal } from 'create-vercel-http-server-handler';
import replaceAll from 'string.prototype.replaceall';

replaceAll.shim();

export const useGlobal: UseGlobal = async (app) => {
  app.use(helmet());
  app.enableCors();

  // only exists in NestExpressApplication
  if ('disable' in app) app.disable('x-powered-by');

  return app;
};
