import { createVercelHandler } from 'create-vercel-http-server-handler';
import { AppModule } from './app/app.module';
import { useGlobal } from './useGlobal';

export default createVercelHandler({
  AppModule,
  useGlobal,
});
