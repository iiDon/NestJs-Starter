export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type JWTPayload = {
  id: string;
  phone: string;
  name?: string;
  role: ROLE;
};
