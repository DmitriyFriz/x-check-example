export const SIGN_IN = 'SIGN_IN';

export type TUserData = {
  githubId: string | null;
  role: 'author' | 'student' | null;
};

export type TSignIn = {
  type: typeof SIGN_IN;
  payload: TUserData;
};

export type TAction = TSignIn;