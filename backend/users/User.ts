import { UserType } from '../types';
import Password from '../utils/Password';

export default class User {
  public userData: UserType;

  static createId(): string {
    const id = Math.round(Date.now()).toString();
    return id;
  }

  constructor(userData?: UserType) {
    this.userData = userData || {
      name: '',
      email: '',
      password: '',
      id: User.createId()
    };
    if (!userData?.id) {
      this.userData.id = User.createId();
    }
  }

  set name(name: string) {
    this.userData.name = name;
  }

  set email(email: string) {
    this.userData.email = email;
  }

  set password(password: string) {
    this.userData.password = password;
  }

  get value(): UserType {
    return this.userData;
  }

  isValid(): boolean {
    if (
      this.userData.name.length &&
      this.userData.email.length &&
      this.userData.password.length
    ) {
      return true;
    }
    return false;
  }

  async validatePassword(enclaire: string) {
    return Password.compare(this.userData.password, enclaire);
  }
}
