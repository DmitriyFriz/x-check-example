export const SIGN_IN = 'SIGN_IN';
export const LOG_OUT = 'LOG_OUT';

export type TRole = 'author' | 'student' | null;

export type TStatus = 'unauthorized' | 'authorized' | null;

export type TUserData = {
  githubId: string | null;
  role: TRole;
};

export type TSignIn = {
  type: typeof SIGN_IN;
  payload: TUserData;
};

export type TLogOut = {
  type: typeof LOG_OUT;
};

export type TState = TUserData & {
  status: TStatus;
};

export type TAction = TSignIn | TLogOut;
