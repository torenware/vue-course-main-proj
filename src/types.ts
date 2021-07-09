export const LS_UNSET = 0;
export const LS_LOADING = 1;
export const LS_LOADED = 2;

export interface CoachAttribs {
  firstName: string;
  lastName: string;
  areas: string[];
  description: string;
  hourlyRate: number;
}

export interface RequestAttribs {
  title: string;
  email: string;
  message: string;
}

export interface UserAttribs {
  name: string;
  email: string;
  password: string;
}

export interface Request extends RequestAttribs {
  id?: string;
  coachId: string;
}

export interface Coach extends CoachAttribs {
  id: string;
}

export interface User {
  name: string;
  email: string;
  id: string;
  token: string;
}

// won't export, blast it.
export enum LoadingState {
  unset = 0,
  loading = 1,
  loaded = 2
}
