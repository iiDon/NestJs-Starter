import { ClsService, type ClsModuleOptions } from 'nestjs-cls';
import { JWTPayload } from 'src/types/auth.type';
import { MyClsStore } from 'src/types/myClsStore';

export const ClsConfig: ClsModuleOptions = {
  global: true, // This makes the module global

  middleware: {
    mount: true,
    setup: (cls: ClsService<MyClsStore>, req) => {
      const token = req.headers['authorization'];

      if (token) {
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString(),
        ) as JWTPayload | null;

        cls.set('user', payload);
      } else {
        cls.set('user', null);
      }
    },
  },
};
