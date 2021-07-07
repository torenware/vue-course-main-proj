import type { UserType } from '../types';
import User from './User'
import UserFile from './UserFile'
import Password from '../utils/Password';

type UserKeys = keyof UserType;

export default class UserData {
   data: UserType[];
   file: UserFile;

   static loadFromFile(file: UserFile): UserData {
      const data = file.readData();
      return new UserData(file, data);
   }

   constructor(file: UserFile,  users: UserType[]) {
     this.file = file;
     this.data = users;
   }

   writeToFile() {
     this.file.writeData(this.data);
   }

   getUsers(): UserType[] {
     return this.data;
   }

   getUserById(id: string): UserType | undefined {
     return this.data.find(user => {
       return user.id === id;
     })
   }

   getUsersByField(field: UserKeys, val: string): UserType[] {
     return this.data.filter(user => {
       return user[field] === val;
     });
   }

   async addUser(userData: UserType) {
     const user = new User(userData);
     if (!user.isValid()) {
       throw new Error("user data is invalid");
     }
     // enforce email uniqueness
     const hasEmail = this.getUsersByField('email', user.value.email);
     if (hasEmail.length) {
       throw new Error("duplicate email in system");
     }

     // Set password hash.
     const enclaire = userData.password;
     user.password = await Password.toHash(enclaire);

     const data = user.value;
     this.data.push(data);
     return data;
   }

}