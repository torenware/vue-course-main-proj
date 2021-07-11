export interface SanitizedUser {
  id?: string;
  name: string;
  email: string;
  role?: string;
}
export interface UserType extends SanitizedUser {
  password: string;
}
